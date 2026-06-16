const fs = require('fs');
['challengesData.ts', 'events.ts', 'badgeConfig.ts'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/rewardCoins:\s*(\d+)/g, (match, p1) => {
    return `rewardCoins: ${parseInt(p1, 10) * 20}`;
  });
  fs.writeFileSync(file, content);
});
console.log('done');
