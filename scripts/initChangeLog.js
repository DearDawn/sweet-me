const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

const CHANGELOG_FILE = path.join(__dirname, '../CHANGE_LOG.md'); // CHANGE_LOG 文件路径

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 存储 CHANGE_LOG 的数组
const changeLogEntries = [];

// 获取当前日期
function getCurrentDate () {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 逐行询问 CHANGE_LOG 条目
function askChangeLogEntry (first = false) {
  const prompts = first ? '请输入 CHANGE_LOG 条目（Ctrl+C 结束）: \n' : ''
  rl.question(prompts, (entry) => {
    if (entry.trim() === '') {
      // 如果输入为空行，则结束交互
      rl.close();
    } else {
      // 将条目添加到数组中
      changeLogEntries.push(entry);
      // 继续下一行的询问
      askChangeLogEntry();
    }
  });
}

// 读取现有的 CHANGE_LOG 文件内容
function readExistingChangeLog () {
  return fs.readFileSync(CHANGELOG_FILE, 'utf8');
}

// 将 CHANGE_LOG 内容写入文件
function writeChangeLogToFile (changeLogContent) {
  return new Promise((resolve, reject) => {
    fs.writeFile(CHANGELOG_FILE, changeLogContent, 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// 开始交互式填写 CHANGE_LOG
askChangeLogEntry(true);

// 监听 readline 的 close 事件，在交互结束后生成 CHANGE_LOG
rl.on('close', async () => {
  const existingContent = readExistingChangeLog();
  const currentDate = getCurrentDate();
  const title = `v${version} - ${currentDate}\n--------------------\n`;

  // 构建新的 CHANGE_LOG 内容
  const content = changeLogEntries.map((entry) => `- ${entry}`).join('\n');

  if (!content.trim()) return;

  // 在新内容顶部添加版本号和日期
  const newContent = title + content + `\n\n${existingContent}`;

  // 将新的 CHANGE_LOG 内容写入文件
  await writeChangeLogToFile(newContent);

  console.log(`CHANGE_LOG 更新成功`);
});