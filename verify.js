const q = require('./questions.json');
const adv = q.questions.filter(x => x.level === 'advanced');
console.log('Advanced total:', adv.length);
const withAnswer = adv.filter(x => x.answer && x.answer.includes('answer-card'));
console.log('Advanced with rich answers:', withAnswer.length);
const empty = adv.filter(x => !x.answer || x.answer.trim() === '');
console.log('Advanced with empty answers:', empty.length);
console.log('\nAll levels:');
['basic','intermediate','advanced'].forEach(l => {
  const qs = q.questions.filter(x => x.level === l);
  const rich = qs.filter(x => x.answer && x.answer.includes('answer-card'));
  console.log('  ' + l + ': ' + qs.length + ' total, ' + rich.length + ' with rich answers');
});
console.log('\nTotal questions:', q.questions.length);
const allRich = q.questions.filter(x => x.answer && x.answer.includes('answer-card'));
console.log('Total with rich answers:', allRich.length);
