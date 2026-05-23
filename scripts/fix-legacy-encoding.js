const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '../src/pages/legacy/KyokushinkaikanLegacy.js');
let content = execSync('git show HEAD:src/pages/Kyokushinkaikan.js', {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

content = content
  .replace(/from '\.\.\/components\//g, "from '../../components/")
  .replace('const Kyokushinkaikan =', 'const KyokushinkaikanLegacy =')
  .replace('export default Kyokushinkaikan', 'export default KyokushinkaikanLegacy');

fs.writeFileSync(out, content, 'utf8');
console.log('Written', out, 'chars:', content.length);
