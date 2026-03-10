const data = require('./questions.json');
const topics = {};
data.questions.filter(q => q.level === 'basic').forEach(q => {
  const cat = q.category;
  if (!topics[cat]) topics[cat] = [];
  const tag = q.tags[0];
  if (!topics[cat].includes(tag)) topics[cat].push(tag);
});
Object.entries(topics).forEach(([cat, tags]) => {
  console.log(cat + ' (' + tags.length + ' topics):', tags.join(', '));
});
