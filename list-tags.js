const d = require('./questions.json');
const META = new Set(['2-3-years','basic','intermediate','advanced','architecture','coding','theory','scenario','debugging','frontend','languages','styling','backend','database','genai','cloudtools','testing','cicd','coding-round','implementation','interview-strategy']);
const tags = new Map();
d.questions.forEach(q => (q.tags || []).forEach(t => {
  if (!META.has(t)) tags.set(t, (tags.get(t) || 0) + 1);
}));
const sorted = [...tags.entries()].sort((a, b) => b[1] - a[1]);
console.log('Tech-specific tags:', sorted.length);
sorted.forEach(([t, c]) => console.log(c, t));
