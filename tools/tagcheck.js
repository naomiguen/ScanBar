const fs = require('fs');
const p = 'c:/Users/Administrator/ScanBar/frontend/src/views/HomeView.vue';
const s = fs.readFileSync(p, 'utf8');
let stack = [];
const lines = s.split('\n');
let inScript = false, inStyle = false, inTemplate = false;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('<template>')) inTemplate = true;
  if (l.includes('</template>')) inTemplate = false;
  if (l.match(/<script(\s|>|$)/)) inScript = true;
  if (l.match(/<\/script>/)) inScript = false;
  if (l.match(/<style(\s|>|$)/)) inStyle = true;
  if (l.match(/<\/style>/)) inStyle = false;
  if (!inTemplate) continue;
  // remove comments
  const line = l.replace(/<!--.*?-->/g, '').trim();
  if (!line) continue;
  // self-closing
  if (/^<\w+[^>]*\/\s*>$/.test(line)) continue;
  // opening tag
  const open = line.match(/^<([a-zA-Z0-9-]+)(\s|>)/);
  const close = line.match(/^<\/([-\w]+)>/);
  // ignore directives like <qrcode-stream ...>
  if (open && !line.startsWith('</') && !line.includes('</')) {
    const tag = open[1];
    if (tag === 'template') continue;
    // don't push template root markers like <div v-if...> etc are fine
    stack.push({ tag, line: i + 1 });
  }
  if (close) {
    if (stack.length === 0) {
      console.log('UNEXPECTED CLOSE', close[1], 'at', i + 1);
      process.exit(1);
    }
    const top = stack.pop();
    if (top.tag !== close[1]) {
      console.log('MISMATCH at', i + 1, 'found closing </' + close[1] + " but top of stack is <" + top.tag + " at line " + top.line);
      process.exit(1);
    }
  }
}
if (stack.length > 0) {
  const top = stack[stack.length - 1];
  console.log('UNCLOSED TAG', top.tag, 'opened at', top.line);
  process.exit(1);
}
console.log('TAGS BALANCED');
