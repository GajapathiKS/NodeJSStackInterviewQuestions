const q = JSON.parse(require('fs').readFileSync('questions.json', 'utf8'));
const inter = q.questions.filter(x => x.level === 'intermediate');
const cats = {};
inter.forEach(x => {
  const c = x.category;
  if (!cats[c]) cats[c] = [];
  cats[c].push(x.id);
});
Object.entries(cats).forEach(([cat, ids]) => {
  console.log(cat, ids.length, 'IDs:', ids[0] + '-' + ids[ids.length - 1]);
});
console.log('\nTotal intermediate:', inter.length);
