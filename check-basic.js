const q = require('./questions.json').questions;
const basic = q.filter(x => x.level === 'basic');
const withCard = basic.filter(x => x.answer && x.answer.includes('answer-card'));
const withHtml = basic.filter(x => x.answer && x.answer.includes('<div'));
const withContent = basic.filter(x => x.answer && x.answer.length > 100);
const empty = basic.filter(x => !x.answer || x.answer.trim() === '');
console.log('Basic total:', basic.length);
console.log('With answer-card:', withCard.length);
console.log('With <div:', withHtml.length);
console.log('With >100 chars:', withContent.length);
console.log('Empty:', empty.length);
const noCard = basic.filter(x => x.answer && !x.answer.includes('answer-card') && x.answer.length > 100);
console.log('With content but no answer-card:', noCard.length);
if (noCard.length > 0) {
  console.log('\nSample ID:', noCard[0].id, noCard[0].question);
  console.log('First 300 chars:', noCard[0].answer.substring(0, 300));
}
