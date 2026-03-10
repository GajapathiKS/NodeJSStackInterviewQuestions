const data = require('./questions.json');
const basics = data.questions.filter(q => q.level === 'basic');
const byCat = {};
basics.forEach(q => {
  if (!byCat[q.category]) byCat[q.category] = [];
  byCat[q.category].push({ id: q.id, question: q.question.substring(0, 80), tags: q.tags[0] });
});
Object.entries(byCat).forEach(([cat, qs]) => {
  console.log(`\n=== ${cat} (${qs.length} basic) ===`);
  qs.forEach(q => console.log(`  ID ${q.id}: [${q.tags}] ${q.question}`));
});
