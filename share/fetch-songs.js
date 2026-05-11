//Node.js 环境 下载歌曲 网页用不了
const fs = require('fs');
const path = require('path');
const https = require('https');

const musicDir = path.join(__dirname, 'music');

const musicJsPath = path.join(__dirname, 'music.js');
const musicJsContent = fs.readFileSync(musicJsPath, 'utf-8');
const match = musicJsContent.match(/const\s+songIds\s*=\s*\[([\s\S]*?)\];/);
const songIds = match[1].split(',').map(id => id.trim().replace(/'/g, ''));

console.log('找到歌曲数量:', songIds.length);

function fetchData(songId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.paugram.com/netease/?id=${songId}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`解析失败: ${songId}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const songId of songIds) {
    const filePath = path.join(musicDir, `${songId}.json`);

    if (fs.existsSync(filePath)) {
      console.log(`跳过（已存在）: ${songId}`);
      continue;
    }

    try {
      const data = await fetchData(songId);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`保存成功: ${songId} - ${data.title}`);
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`失败: ${songId}`, e.message);
    }
  }
  console.log('全部完成！');
}

main();