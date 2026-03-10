const q = require('./questions.json').questions;
const adv = q.filter(x => x.level === 'advanced');
const cats = {};
adv.forEach(x => {
  if (!cats[x.category]) cats[x.category] = [];
  cats[x.category].push({ id: x.id, question: x.question, type: x.type });
});
Object.keys(cats).sort().forEach(cat => {
  console.log(`\n=== ${cat} (${cats[cat].length} questions) ===`);
  cats[cat].forEach(q => console.log(`  ${q.id}: [${q.type}] ${q.question}`));
});
console.log('\nTotal advanced:', adv.length);
