const q = JSON.parse(require('fs').readFileSync('questions.json', 'utf8'));
const cat = process.argv[2];
const level = process.argv[3] || 'intermediate';
const qs = q.questions.filter(x => x.category === cat && x.level === level);
qs.forEach(x => console.log(x.id, x.question.substring(0, 90)));
