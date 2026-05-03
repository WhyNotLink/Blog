// ============================================
// Toast 提示
// ============================================
class Toast {
    show(msg, duration = 3000) {
        document.getElementById('toastMessage').textContent = msg;
        document.getElementById('toast').classList.remove('hidden');
        setTimeout(() => document.getElementById('toast').classList.add('hidden'), duration);
    }
}

// ============================================
// GitHub OAuth
// ============================================
class GitHubService {
    constructor() {
        this.clientId = 'Ov23liqFcIgZGNAkpbmH';
        this.tokenKey = 'github_token';
        this.userKey = 'github_user';
        this.repoName = 'language-setting';
        this.fileName = 'data.json';
    }

    getRedirectUri() { return window.location.origin + '/Blog/share/auth/callback.html'; }

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    async generateCodeChallenge(verifier) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
        return btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    async login() {
        const verifier = this.generateRandomString(64);
        const challenge = await this.generateCodeChallenge(verifier);
        const state = this.generateRandomString(16);
        sessionStorage.setItem('pkce_verifier', verifier);
        sessionStorage.setItem('oauth_state', state);
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.getRedirectUri())}&scope=repo&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;
    }

    async handleCallback(code, state) {
        if (state !== sessionStorage.getItem('oauth_state')) throw new Error('状态验证失败');
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('pkce_verifier');
        const data = await (await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ client_id: this.clientId, code, code_verifier: sessionStorage.getItem('pkce_verifier') })
        })).json();
        if (data.error) throw new Error(data.error_description || '授权失败');
        this.setToken(data.access_token);
        return this.getUser();
    }

    loginWithToken(token) { this.setToken(token); return this.getUser(); }
    setToken(token) { localStorage.setItem(this.tokenKey, token); }
    getToken() { return localStorage.getItem(this.tokenKey); }
    isLoggedIn() { return !!this.getToken(); }
    logout() { localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.userKey); }

    async getUser() {
        const cached = localStorage.getItem(this.userKey);
        if (cached) return JSON.parse(cached);
        const token = this.getToken();
        if (!token) return null;
        const res = await fetch('https://api.github.com/user', { headers: { Authorization: `token ${token}` } });
        if (!res.ok) { if (res.status === 401) this.logout(); throw new Error('获取用户信息失败'); }
        const user = await res.json();
        localStorage.setItem(this.userKey, JSON.stringify(user));
        return user;
    }

    async getOrCreateRepo() {
        const user = await this.getUser();
        const res = await fetch(`https://api.github.com/repos/${user.login}/${this.repoName}`, { headers: { Authorization: `token ${this.getToken()}` } });
        if (res.status === 404) {
            const create = await fetch('https://github.com/user/repos', {
                method: 'POST', headers: { Authorization: `token ${this.getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: this.repoName, description: '语言学习设置与进度', private: true })
            });
            if (!create.ok) throw new Error('创建仓库失败');
            return create.json();
        }
        return res.json();
    }

    async ensureRepoAndFile() {
        if (!this.getToken()) throw new Error('未登录');
        await this.getUser();
        await this.getOrCreateRepo();
        try {
            const res = await fetch(`https://api.github.com/repos/${(await this.getUser()).login}/${this.repoName}/contents/${this.fileName}`, { headers: { Authorization: `token ${this.getToken()}` } });
            if (res.ok) return;
        } catch (e) {}
        await this.saveData(this.getDefaultData());
    }

    async getData() {
        if (!this.getToken()) return this.getDefaultData();
        try {
            const user = await this.getUser();
            const res = await fetch(`https://api.github.com/repos/${user.login}/${this.repoName}/contents/${this.fileName}`, { headers: { Authorization: `token ${this.getToken()}` } });
            if (!res.ok) return this.getDefaultData();
            return JSON.parse(atob((await res.json()).content));
        } catch { return this.getDefaultData(); }
    }

    async saveData(data) {
        if (!this.getToken()) { localStorage.setItem('pending_data', JSON.stringify(data)); throw new Error('未登录'); }
        try {
            const user = await this.getUser();
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
            let sha;
            try { sha = (await (await fetch(`https://api.github.com/repos/${user.login}/${this.repoName}/contents/${this.fileName}`, { headers: { Authorization: `token ${this.getToken()}` } })).json()).sha; } catch (e) {}
            const res = await fetch(`https://api.github.com/repos/${user.login}/${this.repoName}/contents/${this.fileName}`, {
                method: 'PUT', headers: { Authorization: `token ${this.getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: '更新数据', content, sha })
            });
            if (!res.ok) throw new Error('保存失败');
        } catch (e) { localStorage.setItem('pending_data', JSON.stringify(data)); throw e; }
    }

    getDefaultData() {
        return {
            settings: { wordBook: 'cet4', dailyGoal: 10, maxReviewList: 3, reminderTime: '09:00', reminderEnabled: false },
            //用户现在正在学习的单词组;nowList: {'cet4': 1},
            nowList: {},
            //0:未学习, 1:不认识, 2:有点难, 3:认识, 4:很简单;wordsLevel: {'cet4': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},   
            wordsLevel: {},
            //用户学习时间与当天强度;learningIntensity: {'cet4': {'2026/04/22': 2, '2026/04/23': 1, '2026/04/24': 3, '2026/04/25': 0}}
            learningIntensity: {}   
        };
    }
}


// ============================================
// 初始化
// ============================================
let data = {};
let nowlist = {};
let totalWords = 0;
let worddata = {};
let activeList = 0;
let todaywordStack = [];
let currentWord = {};
let reviewwordStack = [];
let toast = new Toast();
let mode = 'remember';

async function init() {
    const github = new GitHubService();
    
    document.getElementById('githubLoginBtn').addEventListener('click', () => github.login());
    window.addEventListener('github_auth_success', async () => {
        await updateLoginUI(github);
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
        window.history.replaceState({}, '', window.location.pathname);
        window.dispatchEvent(new Event('github_auth_success'));
    } else if (github.isLoggedIn()) {
        await updateLoginUI(github);
    }

    
}
async function getNumberofwords() {
    const response = await fetch('/Blog/share/language-word/' + data.settings.wordBook+'.json');
    worddata = await response.json();
    totalWords = worddata.words.length;
}

async function updateWordData() {
    const newWords = {};
    for (let i = 0; i < Math.ceil(totalWords / data.settings.dailyGoal); i++) {
        const start = i * data.settings.dailyGoal;
        const end = Math.min(start + data.settings.dailyGoal, totalWords);
        newWords[i] = worddata.words.slice(start, end);
    }
    worddata = newWords;
}
async function generateWordCard() {
    const container = document.querySelector('.active-list-container');
    container.innerHTML = '';
    const wordqty = worddata[activeList].length;  
    console.log(activeList);
    for (let i = 0; i < wordqty; i++) {
        const item = document.createElement('button');
        item.classList.add('word-card');
        const level = data.wordsLevel[data.settings.wordBook][activeList*data.settings.dailyGoal + i];
        if(level === 1) {
            item.classList.add('level1');
        }
        else if(level === 2) {
            item.classList.add('level2');
        }
        else if(level === 3) {
            item.classList.add('level3');
        }
        else if(level === 4) {
            item.classList.add('level4');
        }

        item.innerHTML = worddata[activeList][i].word + '<br>' + worddata[activeList][i].meaning;
        container.appendChild(item);
    }
}

async function generateWordList() {
    const container = document.querySelector('.word-list-container');
    container.innerHTML = '';
    for (let i = 0; i < Math.ceil(totalWords / data.settings.dailyGoal); i++) {
        const item = document.createElement('button');
        item.classList.add('wordlist-card');
        item.textContent = 'List ' + (i+1);
        if(data.nowList[data.settings.wordBook] === i) {
            item.classList.add('today');
        }
        if(activeList === i) {
            item.classList.add('active');
        }
        item.addEventListener('click', async () => {
            document.querySelectorAll('.wordlist-card').forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
            activeList = i;
            await generateWordCard();
        });
        container.appendChild(item);
    }
}

async function rememberModeRefresh(github) {
    await getNumberofwords();
    await updateWordData();
    if(!(data.settings.wordBook in data.nowList)) {
        data.nowList[data.settings.wordBook] = 0;
        data.wordsLevel[data.settings.wordBook] = new Array(totalWords).fill(0);
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}/${month}/${day}`;
        data.learningIntensity[data.settings.wordBook] = {[todayStr]: 0};
        await github.saveData(data);
    }
    await generateWordList();
    await generateWordCard();

}

async function todayscheduleRefresh() {
    const currentList = data.nowList[data.settings.wordBook];
    const start = currentList * data.settings.dailyGoal;
    const end = Math.min(start + data.settings.dailyGoal, totalWords);
    let learnedCount = 0;
    for(let i = start; i < end; i++) {
        if(data.wordsLevel[data.settings.wordBook][i] > 1) {
            learnedCount++;
        }
    }
    const total = end - start;
    const percent = total > 0 ? Math.round((learnedCount / total) * 100) : 0;
    document.getElementById('todayProgress').textContent = `${learnedCount} / ${total}`;
    document.getElementById('progressFill').style.width = `${percent}%`;
}

async function weekscheduleRefresh() {
    const container = document.getElementById('weekPlan');
    container.innerHTML = '';
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));

    for(let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}/${month}/${day}`;
        const dayName = ['日', '一', '二', '三', '四', '五', '六'][i];
        const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        const hasStudied = data.learningIntensity[data.settings.wordBook] &&
                          data.learningIntensity[data.settings.wordBook][dateStr] > 0;

        const dayEl = document.createElement('div');
        dayEl.classList.add('week-day');
        if(isToday) dayEl.classList.add('today');
        if(hasStudied) dayEl.classList.add('studied');
        dayEl.innerHTML = `
            <span class="week-day-name">${dayName}</span>
            <span class="week-day-num">${date.getDate()}</span>
        `;
        container.appendChild(dayEl);
    }
}

async function reviewscheduleRefresh() {
    let k = 0;
    for(let i = 0; i < data.settings.maxReviewList; i++)
    {
        const targetList = data.nowList[data.settings.wordBook] - 2 ** i;
        if(targetList < 0 )
        {
            break;
        }
        if(worddata[targetList])
        {
            worddata[targetList].forEach(() => {
                k++;
            });
        }
    }
    document.getElementById('reviewCount').textContent = k;
    
}

async function contributonRefresh() {
    const monthsContainer = document.getElementById('contributionMonths');
    const graphContainer = document.getElementById('contributionGraph');
    monthsContainer.innerHTML = '';
    graphContainer.innerHTML = '';

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 119);

    let currentMonth = -1;
    const weeks = [];
    let currentWeek = [];

    for(let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const month = d.getMonth();
        if(month !== currentMonth) {
            if(currentMonth !== -1) {
                const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                monthsContainer.innerHTML += `<span style="flex:1">${monthNames[month]}</span>`;
            }
            currentMonth = month;
        }

        const year = d.getFullYear();
        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}/${monthStr}/${day}`;
        let intensity = 0;
        if(data.learningIntensity[data.settings.wordBook] && data.learningIntensity[data.settings.wordBook][dateStr]) {
            intensity = Math.min(4, Math.ceil(data.learningIntensity[data.settings.wordBook][dateStr] / 3));
        }

        currentWeek.push(`<div class="contribution-day level-${intensity}"></div>`);

        if(d.getDay() === 6 || d.getTime() === today.getTime()) {
            weeks.push(`<div class="contribution-week">${currentWeek.join('')}</div>`);
            currentWeek = [];
        }
    }

    monthsContainer.innerHTML = '<span style="flex:0"></span>' + monthsContainer.innerHTML;
    graphContainer.innerHTML = weeks.join('');
}

async function studyschduleRefresh() {
    await todayscheduleRefresh();
    await weekscheduleRefresh();
    await reviewscheduleRefresh();
    await contributonRefresh();
}

async function testnextWord(num, github) {
        await todayscheduleRefresh();
        currentWord = todaywordStack.shift();
        if(num <= 1) {
            todaywordStack.push(currentWord);
        }
        if(todaywordStack.length === 0) {
            document.getElementById('length-eq-zero-dis').classList.add('hidden');
            const testSection = document.getElementById('testSection');
            const item = document.createElement('div');
            item.classList.add('testfinish');
            item.textContent = '你已经掌握了今日份所有单词!';

            if(data.nowList[data.settings.wordBook] < Math.ceil(totalWords / data.settings.dailyGoal) - 1) {
 
            }else {
                item.textContent = '恭喜你,本书学完啦!';
            }
            testSection.appendChild(item);

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}/${month}/${day}`;

            data.learningIntensity[data.settings.wordBook][todayStr] = 1;
            await github.saveData(data);
            return;
        }
        currentWord = todaywordStack[0];
        console.log(todaywordStack.length);

        document.getElementById('testWordText').textContent = currentWord.word;
        document.getElementById('testWordPhonetic').textContent = currentWord.phonetic;
        document.getElementById('testWordMeaning').textContent = currentWord.meaning;
        document.getElementById('testWordExample').textContent = currentWord.example;
}

async function testModeRefresh(github) {
    const testFlashcard = document.getElementById('testFlashcard');
    testFlashcard.onclick = () => {
        testFlashcard.classList.toggle('flipped');
    };
    const testFlipBtn = document.getElementById('testFlipBtn');
    testFlipBtn.onclick = () => {
        testFlashcard.classList.toggle('flipped');
    };

    start = data.nowList[data.settings.wordBook] * data.settings.dailyGoal;
    todaywordStack = [];
    worddata[data.nowList[data.settings.wordBook]].forEach((word, index) => {
        if(data.wordsLevel[data.settings.wordBook][start + index] > 1) {
            return;
        }
        todaywordStack.push({...word,originalIndex:start + index});
    })

    if(todaywordStack.length !== 0) {
        currentWord = todaywordStack[0];
        document.getElementById('testWordText').textContent = currentWord.word;
        document.getElementById('testWordPhonetic').textContent = currentWord.phonetic;
        document.getElementById('testWordMeaning').textContent = currentWord.meaning;
        document.getElementById('testWordExample').textContent = currentWord.example;
    }else {
        document.getElementById('length-eq-zero-dis').classList.add('hidden');
        const existingItem = document.querySelector('.testfinish');
        if(existingItem) {
            existingItem.remove();
        }
        const testSection = document.getElementById('testSection');
        const item = document.createElement('div');
        item.classList.add('testfinish');
        item.textContent = '你已经掌握了今日份所有单词!';

        if(data.nowList[data.settings.wordBook] < Math.ceil(totalWords / data.settings.dailyGoal) - 1) {

        }else {
            item.textContent = '恭喜你,本书学完啦!';
        }
        testSection.appendChild(item);
    }
    const testNextBtn = document.getElementById('testNextBtn');
    testNextBtn.onclick = () => {
        testFlashcard.classList.remove('flipped');

        currentWord = todaywordStack.shift();
        todaywordStack.push(currentWord);
        currentWord = todaywordStack[0];

        document.getElementById('testWordText').textContent = currentWord.word;
        document.getElementById('testWordPhonetic').textContent = currentWord.phonetic;
        document.getElementById('testWordMeaning').textContent = currentWord.meaning;
        document.getElementById('testWordExample').textContent = currentWord.example;
    };
    const testPrevBtn = document.getElementById('testPrevBtn');
    testPrevBtn.onclick = () => {
        testFlashcard.classList.remove('flipped');

        currentWord = todaywordStack.pop();
        todaywordStack.unshift(currentWord);
        currentWord = todaywordStack[0];

        document.getElementById('testWordText').textContent = currentWord.word;
        document.getElementById('testWordPhonetic').textContent = currentWord.phonetic;
        document.getElementById('testWordMeaning').textContent = currentWord.meaning;
        document.getElementById('testWordExample').textContent = currentWord.example;
    };

    const testforgetBtn = document.getElementById('testMarkForgetBtn');
    testforgetBtn.onclick = () => {
        testFlashcard.classList.remove('flipped');
        data.wordsLevel[data.settings.wordBook][currentWord.originalIndex] = 1;
        testnextWord(1, github);
    };
    const testhardBtn = document.getElementById('testMarkHardBtn');
    testhardBtn.onclick = () => {
        testFlashcard.classList.remove('flipped');
        data.wordsLevel[data.settings.wordBook][currentWord.originalIndex] = 2;
        testnextWord(2, github);
    };
    const testknowBtn = document.getElementById('testMarkKnowBtn');
    testknowBtn.onclick = () => {
        testFlashcard.classList.remove('flipped');
        data.wordsLevel[data.settings.wordBook][currentWord.originalIndex] = 3;        
        testnextWord(3, github);
    };
    const testeasyBtn = document.getElementById('testMarkEasyBtn');
    testeasyBtn.onclick = () => {
        testFlashcard.classList.remove('flipped');
        data.wordsLevel[data.settings.wordBook][currentWord.originalIndex] = 4;
        testnextWord(4, github);
    };
}
//
async function reviewModeRefresh(github) {
    reviewwordStack = [];
    for(let i = 0; i < data.settings.maxReviewList; i++) {
        const targetList = data.nowList[data.settings.wordBook] - 2 ** i;
        if(targetList < 0) {
            break;
        }
        if(worddata[targetList]) {
            worddata[targetList].forEach((word, index) => {
                reviewwordStack.push({...word, originalList: targetList, originalIndex: targetList * data.settings.dailyGoal + index});
            });
        }
    }

    const container = document.getElementById('reviewContainer');
    container.innerHTML = '';

    if(reviewwordStack.length === 0) {
        container.innerHTML = '<div class="empty-review">暂无需要复习的单词</div>';
        return;
    }

    container.innerHTML = `
        <div class="review-header">
            <span class="review-count">待复习: <strong>${reviewwordStack.length}</strong> 个单词</span>
        </div>
        <div class="review-list" id="reviewList"></div>
        <div class="review-detail hidden" id="reviewDetail">
            <div class="detail-header">
                <h3 id="detailWord"></h3>
                <button class="btn-close" id="closeDetailBtn">×</button>
            </div>
            <div class="detail-content">
                <p class="detail-phonetic" id="detailPhonetic"></p>
                <p class="detail-meaning" id="detailMeaning"></p>
                <p class="detail-example" id="detailExample"></p>
            </div>
            <div class="mastery-controls">
                <button class="btn btn-mastery" id="reviewMarkForgetBtn">
                    <span>😵</span><span>不认识</span>
                </button>
                <button class="btn btn-mastery" id="reviewMarkHardBtn">
                    <span>🤔</span><span>有点难</span>
                </button>
                <button class="btn btn-mastery" id="reviewMarkKnowBtn">
                    <span>😊</span><span>认识</span>
                </button>
                <button class="btn btn-mastery" id="reviewMarkEasyBtn">
                    <span>😎</span><span>很简单</span>
                </button>
            </div>
        </div>
    `;

    const reviewList = document.getElementById('reviewList');
    const reviewDetail = document.getElementById('reviewDetail');
    let currentDetailIndex = 0;
    const reviewItems = [];

    const levelText = ['', '不认识', '有点难', '认识', '很简单'];
    reviewwordStack.forEach((word, index) => {
        const level = data.wordsLevel[data.settings.wordBook][word.originalIndex];
        const statusText = level === 0 ? '没学过' : levelText[level];
        const item = document.createElement('div');
        const meaningSpan = document.createElement('span');
        meaningSpan.classList.add('review-item-meaning');
        meaningSpan.textContent = statusText;
        item.classList.add('review-item');
        item.innerHTML = `
            <span class="review-item-word">${word.word}</span>
            <span class="review-item-arrow"></span>
        `;
        item.appendChild(meaningSpan);
        item.onclick = () => {
            currentDetailIndex = index;
            document.getElementById('detailWord').textContent = word.word;
            document.getElementById('detailPhonetic').textContent = word.phonetic;
            document.getElementById('detailMeaning').textContent = word.meaning;
            document.getElementById('detailExample').textContent = word.example;
            reviewDetail.classList.remove('hidden');
        };
        reviewList.appendChild(item);
        reviewItems.push(meaningSpan);
    });

    document.getElementById('closeDetailBtn').onclick = () => {
        reviewDetail.classList.add('hidden');
    };

    document.getElementById('reviewMarkForgetBtn').onclick = () => {
        const word = reviewwordStack[currentDetailIndex];
        data.wordsLevel[data.settings.wordBook][word.originalIndex] = 1;
        reviewItems[currentDetailIndex].textContent = '不认识';
        reviewDetail.classList.add('hidden');
    };
    document.getElementById('reviewMarkHardBtn').onclick = () => {
        const word = reviewwordStack[currentDetailIndex];
        data.wordsLevel[data.settings.wordBook][word.originalIndex] = 2;
        reviewItems[currentDetailIndex].textContent = '有点难';
        reviewDetail.classList.add('hidden');
    };
    document.getElementById('reviewMarkKnowBtn').onclick = () => {
        const word = reviewwordStack[currentDetailIndex];
        data.wordsLevel[data.settings.wordBook][word.originalIndex] = 3;
        reviewItems[currentDetailIndex].textContent = '认识';
        reviewDetail.classList.add('hidden');
    };
    document.getElementById('reviewMarkEasyBtn').onclick = () => {
        const word = reviewwordStack[currentDetailIndex];
        data.wordsLevel[data.settings.wordBook][word.originalIndex] = 4;
        reviewItems[currentDetailIndex].textContent = '很简单';
        reviewDetail.classList.add('hidden');
    };
}

async function getnowlist() {
    const nowlist = data.nowList;
    return nowlist;
}
async function revisenowlist() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}/${month}/${day}`;

        if(!totalWords) {
            await getNumberofwords();
        }

        if(!(data.settings.wordBook in data.nowList)) {
            data.nowList[data.settings.wordBook] = 0;
            data.wordsLevel[data.settings.wordBook] = new Array(totalWords).fill(0);
            data.learningIntensity[data.settings.wordBook] = {[todayStr]: 0};
        }

        const currentList = data.nowList[data.settings.wordBook];
        const start = currentList * data.settings.dailyGoal;
        const end = Math.min(start + data.settings.dailyGoal, totalWords);
        let noLearnedCount = 0;
        for(let i = start; i < end; i++) {
            if(data.wordsLevel[data.settings.wordBook][i] <= 1) {
                noLearnedCount++;   
            }
        }

        if(!data.learningIntensity[data.settings.wordBook][todayStr])
        {
            //这个list里面全学完了
            if(noLearnedCount === 0)
            {
                if(data.nowList[data.settings.wordBook] < Math.ceil(totalWords / data.settings.dailyGoal) - 1)
                {
                    data.nowList[data.settings.wordBook] = nowlist[data.settings.wordBook] + 1;
                    console.log("当前list:", data.nowList[data.settings.wordBook]);
                }
            }else
            {

            }
        }
}



const CONFIG = {
    owner: 'WhyNotLink',
    AI_API_KEY: 'sk-mx7mwmSK6BPx5J7seyFLcq1bmqoQmrCCHYd4FYR9RmG32uyA',
    AI_API_URL: 'https://api.moonshot.cn/v1/chat/completions',
    AI_MODEL: 'moonshot-v1-8k',
    AI_SYSTEM_PROMPT: '你是一个专业得翻译',
    AI_TEMPERATURE: 0.7,
    AI_MAX_TOKENS: 2000
};

async function callAI(messages){
    const { AI_API_KEY, AI_API_URL, AI_MODEL, AI_SYSTEM_PROMPT, AI_TEMPERATURE, AI_MAX_TOKENS } = CONFIG;
    
    const allMessages = [{role: 'system', content: AI_SYSTEM_PROMPT},{role: 'user', content: messages}];
    
    if(!AI_API_KEY){
        console.warn('AI API Key not set!');
        throw new Error('API Key not set');
    }

    const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_API_KEY}`
        },
        body: JSON.stringify({
            model: AI_MODEL,
            messages: allMessages,
            temperature: AI_TEMPERATURE,
            max_tokens: AI_MAX_TOKENS
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || '未知错误'}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

async function AIModeRefresh(github) {
    const putdata = [];
    start = data.nowList[data.settings.wordBook] * data.settings.dailyGoal;
    worddata[data.nowList[data.settings.wordBook]].forEach((word, index) => {
        putdata.push({word:word.word,originalIndex:start + index});
    })
    console.log(putdata);
    const aigenerateTX = JSON.stringify(putdata) + `请用以上单词（全部或部分）组成3-5个英文句子，返回严格遵守以下JSON格式（必须是有效的JSON，不要有任何额外内容）：
{"sentences": [{"text": "句子内容", "words": ["单词1", "单词2"]}, ...]}`;
    const AIcontainer = document.getElementById('AIContainer');
    AIcontainer.innerHTML = '<div class="ai-loading"><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div></div>';
    const aigenerateRX = await callAI(aigenerateTX);
    console.log(aigenerateTX);
    console.log(aigenerateRX);
    const result = JSON.parse(aigenerateRX);
    AIcontainer.innerHTML = '';
    result.sentences.forEach((sentence) => {
        AIcontainer.innerHTML += `<div class="ai-sentence-container"><div class="ai-sentence-text">${sentence.text}</div><textarea placeholder="输入翻译..." class="chat-input ai-translate-input"></textarea></div>`;
    })
    
    
}


async function updateLoginUI(github) {
    try {
        await github.ensureRepoAndFile();
        const user = await github.getUser();
        if (user) {
            data = await github.getData();
            nowlist = await getnowlist();
            await revisenowlist();
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('appSection').classList.remove('hidden');
            document.getElementById('userAvatar').src = user.avatar_url;
            document.getElementById('userName').textContent = user.login;
            document.getElementById('userAvatar').onclick = () => {
                const settings = data.settings;
                document.getElementById('wordBook').value = settings.wordBook;
                document.getElementById('dailyGoal').value = settings.dailyGoal;
                document.getElementById('maxReviewList').value = settings.maxReviewList;
                document.getElementById('reminderTime').value = settings.reminderTime;
                document.getElementById('reminderEnabled').checked = settings.reminderEnabled;
                document.getElementById('settingsModal').classList.remove('hidden');
            };
            document.getElementById('closeSettingsBtn').onclick = () => {
                document.getElementById('settingsModal').classList.add('hidden');
            };
            document.getElementById('saveSettingsBtn').onclick = async () => {
                const settings = data.settings;
                settings.wordBook = document.getElementById('wordBook').value;
                settings.dailyGoal = Number(document.getElementById('dailyGoal').value);
                settings.maxReviewList = Number(document.getElementById('maxReviewList').value);
                settings.reminderTime = document.getElementById('reminderTime').value;
                settings.reminderEnabled = document.getElementById('reminderEnabled').checked;
                data.settings = settings;
                document.getElementById('settingsModal').classList.add('hidden');
                await revisenowlist();
                activeList = data.nowList[data.settings.wordBook];
                await rememberModeRefresh(github);
                await studyschduleRefresh();
                console.log("当前book:", data.settings.wordBook);
                toast.show('保存成功');
                
            };
            document.getElementById('cancelSettingsBtn').onclick = () => {
                document.getElementById('settingsModal').classList.add('hidden');
            };
            document.getElementById('syncBtn').onclick = async () => {
                // data = await github.getData();
                // await getNumberofwords();
                // await updateWordData();
                await github.saveData(data);
                toast.show('同步成功');
            };
            document.getElementById('logoutBtn').onclick = () => {
                github.logout();
                toast.show('退出成功');
                window.location.href = '/Blog/share/language.html';
            };
            document.getElementById('rememberBtn').onclick = () => {
                document.getElementById('rememberBtn').classList.add('active');
                document.getElementById('testBtn').classList.remove('active');
                document.getElementById('reviewBtn').classList.remove('active');
                document.getElementById('AIBtn').classList.remove('active');
                mode = 'remember';

            };
            document.getElementById('testBtn').onclick = () => {
                document.getElementById('testBtn').classList.add('active');
                document.getElementById('rememberBtn').classList.remove('active');
                document.getElementById('reviewBtn').classList.remove('active');
                document.getElementById('AIBtn').classList.remove('active');
                mode = 'test';
            };
            document.getElementById('reviewBtn').onclick = () => {
                document.getElementById('reviewBtn').classList.add('active');
                document.getElementById('rememberBtn').classList.remove('active');
                document.getElementById('testBtn').classList.remove('active');
                document.getElementById('AIBtn').classList.remove('active');
                mode = 'review';
            };
            document.getElementById('AIBtn').onclick = () => {
                document.getElementById('AIBtn').classList.add('active');
                document.getElementById('rememberBtn').classList.remove('active');
                document.getElementById('testBtn').classList.remove('active');
                document.getElementById('reviewBtn').classList.remove('active');
                mode = 'AI';
            };

            document.addEventListener('keydown', async (event) => {
            if (event.key === 'F5') {
                event.preventDefault();
                await github.saveData(data);
                location.reload();
            }
            });

            if (mode === 'remember') {
                    rememberSection.classList.remove('hidden');
                    testSection.classList.add('hidden');
                    reviewSection.classList.add('hidden');
                    AISection.classList.add('hidden');
                    activeList = data.nowList[data.settings.wordBook];
                    await rememberModeRefresh(github);
                    await studyschduleRefresh();
                }
            document.querySelector('.mode-buttons').onclick = async () => {
                if (mode === 'remember') {
                    rememberSection.classList.remove('hidden');
                    rememberSection.classList.add('active');
                    testSection.classList.remove('active');
                    testSection.classList.add('hidden');
                    reviewSection.classList.remove('active');
                    reviewSection.classList.add('hidden');
                    AISection.classList.remove('active');
                    AISection.classList.add('hidden');
                    await rememberModeRefresh(github);
                    await studyschduleRefresh();

                } else if (mode === 'test') {
                    testSection.classList.remove('hidden');
                    testSection.classList.add('active');
                    rememberSection.classList.remove('active');
                    rememberSection.classList.add('hidden');
                    reviewSection.classList.remove('active');
                    reviewSection.classList.add('hidden');
                    AISection.classList.remove('active');
                    AISection.classList.add('hidden');
                    await testModeRefresh(github);

                } else if (mode === 'review') {
                    reviewSection.classList.remove('hidden');
                    reviewSection.classList.add('active');
                    rememberSection.classList.remove('active');
                    rememberSection.classList.add('hidden');
                    testSection.classList.remove('active');
                    testSection.classList.add('hidden');
                    AISection.classList.remove('active');
                    AISection.classList.add('hidden');
                    await reviewModeRefresh(github);
                } else if (mode === 'AI') {
                    AISection.classList.remove('hidden');
                    AISection.classList.add('active');
                    rememberSection.classList.remove('active');
                    rememberSection.classList.add('hidden');
                    testSection.classList.remove('active');
                    testSection.classList.add('hidden');
                    reviewSection.classList.remove('active');
                    reviewSection.classList.add('hidden');
                    await AIModeRefresh(github);
                }
            };
        }
        
    } catch (e) {
        console.error('获取用户信息失败:', e);
    }
}

window.addEventListener('DOMContentLoaded', init);