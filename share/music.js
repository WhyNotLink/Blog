// 歌曲ID列表 - 只需填写歌曲ID
const songIds = ['1413795920',
    '2633466472',
    '2086217789',
    '2606329521',
    '29027206',
    '2040000970',
    '2050640265',
    '1493625683',
    '745239',
    '452814328',
    '4888191',
    '2028760097',
    '2030147467',
    '1913268601',
    '509106775'];

// 解析歌词
function parseLyric(lyricText) {
  if (!lyricText) return [];
  const lines = lyricText.split('\n');
  const parsed = [];
  
  lines.forEach(line => {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const ms = parseInt(match[3].padEnd(3, '0'));
      const time = minutes * 60 + seconds + ms / 1000;
      const text = match[4].trim();
      if (text) {
        parsed.push({ time, text });
      }
    }
  });
  
  return parsed.sort((a, b) => a.time - b.time);
}

// 格式化歌词显示
function formatLyrics(lyricText) {
  if (!lyricText) return '<div class="lyric-line">暂无歌词</div>';
  const lines = lyricText.split('\n');
  let html = '';
  
  lines.forEach(line => {
    if (line.trim()) {
      const text = line.replace(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g, '').trim();
      const timeMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
      if (text) {
        const time = timeMatch ? parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]) + parseInt(timeMatch[3].padEnd(3, '0')) / 1000 : 0;
        html += `<div class="lyric-line" data-time="${time}">${text}</div>`;
      }
    }
  });
  
  return html || '<div class="lyric-line">暂无歌词</div>';
}

// 更新歌词滚动高亮
function updateLyricHighlight(currentTime) {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;
    
    const songLyrics = lyricsContainer.querySelector('.song-lyrics');
    if (!songLyrics) return;
    
    const lines = songLyrics.querySelectorAll('.lyric-line');
    let currentLine = null;
    
    lines.forEach((line) => {
        const lineTime = parseFloat(line.dataset.time) || 0;
        if (currentTime >= lineTime) {
            currentLine = line;
        }
    });
    
    if (currentLine) {
        lines.forEach(line => line.classList.remove('current'));
        currentLine.classList.add('current');
        
        const containerHeight = songLyrics.clientHeight;
        const targetScroll = currentLine.offsetTop - (containerHeight / 2) + 20;
        songLyrics.scrollTop = targetScroll;
    }
}

// 获取歌曲信息
async function getMusicInfo(songId) {
  try {
    const url = `https://api.paugram.com/netease/?id=${songId}`;
    const response = await fetch(url);
    const data = await response.json();
    return {
      id: songId,
      name: data.title || `歌曲 ${songId}`,
      artist: data.artist || '未知艺术家',
      url: data.link || `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
      cover: data.cover || 'https://picsum.photos/300/200',
      lyric: data.lyric || '',
      subLyric: data.sub_lyric || ''
    };
  } catch (error) {
    console.error('获取歌曲信息失败:', error);
    return {
      id: songId,
      name: `歌曲 ${songId}`,
      artist: '未知艺术家',
      url: `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
      cover: 'https://picsum.photos/300/200',
      lyric: '',
      subLyric: ''
    };
  }
}

// 创建歌曲卡片
function createSongCard(songInfo) {
  const card = document.createElement('div');
  card.className = 'song-card';
  card.dataset.songId = songInfo.id || '';
  
  const lyrics = songInfo.subLyric || songInfo.lyric;
  
  card.innerHTML = `
    <div class="song-row">
        <div class="song-cover-wrapper">
            <img src="${songInfo.cover}" alt="${songInfo.name}" class="song-cover">
            <div class="play-overlay" data-playing="false"></div>
        </div>
        <div class="song-info">
            <div class="song-title">${songInfo.name}</div>
            <div class="song-artist">${songInfo.artist}</div>
        </div>
        <audio controls class="audio-player">
            <source src="${songInfo.url}" type="audio/mpeg">
            您的浏览器不支持音频播放
        </audio>
    </div>

  `;
  
  card.songInfo = songInfo;
  
  return card;
}

// 存储所有歌曲信息
const songInfoMap = new Map();
let currentActiveAudio = null;
let userPaused = false;

// 更新右侧歌词显示
function updateLyricsDisplay(card) {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer || !card || !card.songInfo) return;

    const songInfo = card.songInfo;
    const englishLyric = songInfo.lyric || '';
    const chineseLyric = songInfo.subLyric || '';

    let html = '<div class="song-lyrics"><div class="lyric-lines-wrapper">';

    if (englishLyric || chineseLyric) {
        const englishLines = parseLyric(englishLyric);
        const chineseLines = parseLyric(chineseLyric);

        const maxLen = Math.max(englishLines.length, chineseLines.length);
        for (let i = 0; i < maxLen; i++) {
            const enLine = englishLines[i];
            const zhLine = chineseLines[i];
            const time = enLine ? enLine.time : (zhLine ? zhLine.time : 0);
            const enText = enLine ? enLine.text : '';
            const zhText = zhLine ? zhLine.text : '';

            if (enText || zhText) {
                html += `<div class="lyric-line" data-time="${time}">`;
                if (enText) html += `<span class="lyric-en">${enText}</span>`;
                if (zhText) html += `<span class="lyric-zh">${zhText}</span>`;
                html += '</div>';
            }
        }
    } else {
        html += '<div class="lyric-line" data-time="0">暂无歌词</div>';
    }

    html += '</div></div>';
    lyricsContainer.innerHTML = html;
}

// 滚动选中效果
function initScrollSelection() {
    const listContainer = document.querySelector('.list-container');
    const songsContainer = document.getElementById('songs-container');
    
    if (!listContainer || !songsContainer) return;
    
    setTimeout(() => {
        // 先不滚动，让列表自然排列
        // 然后调用updateActiveCard自动检测屏幕中间显示的卡片并设置为激活
        updateActiveCard();
    }, 500);
    
    // 节流函数
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 滚动停止检测变量
    let scrollStopTimer = null;
    
    // 监听滚动事件
    listContainer.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const didLoop = handleLoopScroll();
            if (didLoop) {
                updateActiveCard();
            }
        });
        
        if (scrollStopTimer) {
            clearTimeout(scrollStopTimer);
        }
        scrollStopTimer = setTimeout(() => {
            updateActiveCard();
            scrollStopTimer = null;
        }, 150);
    }); 
    
    // 监听卡片点击
    songsContainer.addEventListener('click', (e) => {
        const playOverlay = e.target.closest('.play-overlay');
        if (playOverlay) return;
        
        const card = e.target.closest('.song-card');
        if (card) {
            card.classList.add('active');
            scrollToCard(card);
            updateLyricsDisplay(card);
        }
    });
    
    // 监听播放按钮点击
    songsContainer.addEventListener('click', (e) => {
        const overlay = e.target.closest('.play-overlay');
        if (overlay) {
            const wrapper = overlay.closest('.song-cover-wrapper');
            const card = wrapper.closest('.song-card');
            const audio = card.querySelector('.audio-player');
            const isPlaying = overlay.getAttribute('data-playing') === 'true';
            
            card.classList.add('active');
            scrollToCard(card);
            updateLyricsDisplay(card);
            
            // 暂停所有其他音频并重置所有overlay状态
            document.querySelectorAll('.audio-player').forEach(a => {
                if (a !== audio) {
                    a.pause();
                    a.currentTime = 0;
                }
            });
            document.querySelectorAll('.play-overlay').forEach(o => {
                if (o !== overlay) {
                    o.setAttribute('data-playing', 'false');
                    o.classList.remove('playing');
                }
            });
            
            // 切换当前音频的播放状态
            if (isPlaying) {
                audio.pause();
                overlay.setAttribute('data-playing', 'false');
                overlay.classList.remove('playing');
                userPaused = true;
            } else {
                audio.play();
                overlay.setAttribute('data-playing', 'true');
                overlay.classList.add('playing');
                userPaused = false;
            }
        }
    });
    
    // 监听音频播放结束事件
    songsContainer.addEventListener('ended', (e) => {
        if (e.target.tagName === 'AUDIO') {
            const card = e.target.closest('.song-card');
            const overlay = card.querySelector('.play-overlay');
            overlay.setAttribute('data-playing', 'false');
            overlay.classList.remove('playing');
            
            const cards = Array.from(songsContainer.querySelectorAll('.song-card'));
            const currentIndex = cards.indexOf(card);
            const nextIndex = (currentIndex + 1) % cards.length;
            const nextCard = cards[nextIndex];
            
            if (nextCard) {
                nextCard.classList.add('active');
                scrollToCard(nextCard);
                updateLyricsDisplay(nextCard);
                
                const nextAudio = nextCard.querySelector('.audio-player');
                const nextOverlay = nextCard.querySelector('.play-overlay');
                if (nextAudio && nextOverlay) {
                    nextAudio.play();
                    nextOverlay.setAttribute('data-playing', 'true');
                    nextOverlay.classList.add('playing');
                    currentActiveAudio = nextAudio;
                    userPaused = false;
                }
            }
        }
    }, true);
    
    // 监听音频本身的play/pause事件（防止直接操作audio元素时状态不同步）
    songsContainer.querySelectorAll('.audio-player').forEach(audio => {
        audio.addEventListener('play', () => {
            currentActiveAudio = audio;
            const card = audio.closest('.song-card');
            const overlay = card.querySelector('.play-overlay');
            overlay.setAttribute('data-playing', 'true');
            overlay.classList.add('playing');
        });
        audio.addEventListener('pause', () => {
            const card = audio.closest('.song-card');
            const overlay = card.querySelector('.play-overlay');
            if (!audio.ended) {
                overlay.setAttribute('data-playing', 'false');
                overlay.classList.remove('playing');
            }
        });
        audio.addEventListener('ended', () => {
            const card = audio.closest('.song-card');
            const overlay = card.querySelector('.play-overlay');
            overlay.setAttribute('data-playing', 'false');
            overlay.classList.remove('playing');
            
            const cards = Array.from(songsContainer.querySelectorAll('.song-card'));
            const currentIndex = cards.indexOf(card);
            const nextIndex = (currentIndex + 1) % cards.length;
            const nextCard = cards[nextIndex];
            
            if (nextCard) {
                nextCard.classList.add('active');
                scrollToCard(nextCard);
                updateLyricsDisplay(nextCard);
                
                const nextAudio = nextCard.querySelector('.audio-player');
                const nextOverlay = nextCard.querySelector('.play-overlay');
                if (nextAudio && nextOverlay) {
                    nextAudio.play();
                    nextOverlay.setAttribute('data-playing', 'true');
                    nextOverlay.classList.add('playing');
                    currentActiveAudio = nextAudio;
                    userPaused = false;
                }
            }
        });
        audio.addEventListener('timeupdate', () => {
            if (audio === currentActiveAudio) {
                updateLyricHighlight(audio.currentTime);
            }
        });
    });
    
    function scrollToCard(card) {
        const containerHeight = listContainer.clientHeight;
        const cardTop = card.offsetTop;
        const cardHeight = card.offsetHeight;
        const targetScrollTop = cardTop - (containerHeight / 2) + (cardHeight / 2);
        listContainer.scrollTop = targetScrollTop;
    }
    
    function updateActiveCard() {
        const cards = songsContainer.querySelectorAll('.song-card');
        let closestCard = null;
        let minDistance = Infinity;

        const containerRect = listContainer.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.top + cardRect.height / 2;
            const distance = Math.abs(cardCenter - containerCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        const previousActiveCard = songsContainer.querySelector('.song-card.active');

        if (closestCard && closestCard !== previousActiveCard) {
            if (currentActiveAudio) {
                currentActiveAudio.pause();
                currentActiveAudio.currentTime = 0;
                const prevOverlay = currentActiveAudio.closest('.song-card').querySelector('.play-overlay');
                prevOverlay.setAttribute('data-playing', 'false');
                prevOverlay.classList.remove('playing');
            }

            cards.forEach(card => {
                card.classList.remove('active');
                card.style.transform = '';
                card.style.opacity = '';
                card.style.zIndex = '';
            });

            closestCard.classList.add('active');
            closestCard.style.transform = 'scale(1.05)';
            closestCard.style.opacity = '1';
            closestCard.style.zIndex = '10';
            updateLyricsDisplay(closestCard);

            const newAudio = closestCard.querySelector('.audio-player');
            const newOverlay = closestCard.querySelector('.play-overlay');
            if (newAudio && newOverlay) {
                if (!userPaused) {
                    const playPromise = newAudio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            newOverlay.setAttribute('data-playing', 'true');
                            newOverlay.classList.add('playing');
                        }).catch(() => {
                            newOverlay.setAttribute('data-playing', 'false');
                            newOverlay.classList.remove('playing');
                        });
                    }
                } else {
                    newOverlay.setAttribute('data-playing', 'false');
                    newOverlay.classList.remove('playing');
                }
                currentActiveAudio = newAudio;
            }

            const allCards = Array.from(cards);
            const activeIndex = allCards.indexOf(closestCard);

            allCards.forEach((card, index) => {
                if (card === closestCard) return;

                const distance = index - activeIndex;
                const absDistance = Math.abs(distance);

                const scale = Math.max(0.7, 1 - absDistance * 0.08);
                const translateX = distance * (15 + absDistance * 5);
                const opacity = Math.max(0.3, 0.8 - absDistance * 0.1);

                card.style.transform = `scale(${scale}) translateX(${translateX}px)`;
                card.style.opacity = opacity;
                card.style.zIndex = '1';
            });
        }
    }
    
    function handleLoopScroll() {
        const cards = songsContainer.querySelectorAll('.song-card');
        if (cards.length === 0) return false;
        
        const cardHeight = cards[0].offsetHeight + 40; // 40是gap
        const containerHeight = listContainer.clientHeight;
        const scrollHeight = songsContainer.scrollHeight;
        const scrollTop = listContainer.scrollTop;
        
        const buffer = cardHeight * 3; // 3个卡片的高度作为余量
        
        // 当滚动到顶部附近时，将最后一个卡片移动到最前面
        if (scrollTop < buffer) {
            const lastCard = cards[cards.length - 1];
            songsContainer.insertBefore(lastCard, cards[0]);
            listContainer.scrollTop = scrollTop + cardHeight;
            return true;
        }
        
        // 当滚动到底部附近时，将第一个卡片移动到最后面
        else if (scrollTop > scrollHeight - containerHeight - buffer) {
            const firstCard = cards[0];
            songsContainer.appendChild(firstCard);
            listContainer.scrollTop = scrollTop - cardHeight;
            return true;
        }
        return false;
    }
}

// 初始化播放器
async function initPlayer() {
  const container = document.getElementById('songs-container');
  if (!container) return;
  
  for (const songId of songIds) {
    const songInfo = await getMusicInfo(songId);
    const card = createSongCard(songInfo);
    container.appendChild(card);
  }
  
  // 初始化滚动选中效果
  initScrollSelection();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initPlayer);