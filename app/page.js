'use client';

import { useMemo, useState } from 'react';
import data from '../questions.json';

const levelOrder = ['basic', 'intermediate', 'advanced'];
const typeOrder = ['all', 'theory', 'coding', 'architecture', 'debugging', 'scenario'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [type, setType] = useState('all');
  const [randomSeed, setRandomSeed] = useState(0);

  const categories = useMemo(() => {
    const map = new Map();
    data.questions.forEach((q) => map.set(q.category, q.categoryTitle));
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.questions.filter((item) => {
      const searchable = [item.question, item.answer, item.categoryTitle, ...(item.tags ?? [])].join(' ').toLowerCase();
      return (!q || searchable.includes(q))
        && (category === 'all' || item.category === category)
        && (level === 'all' || item.level === level)
        && (type === 'all' || item.type === type);
    });
  }, [query, category, level, type]);

  const randomQuestion = useMemo(() => {
    if (!filtered.length) return null;
    return filtered[randomSeed % filtered.length];
  }, [filtered, randomSeed]);

  return (
    <main className="page">
      <header className="topBar">
        <h1>🚀 Interview Mastery UI (Next.js)</h1>
        <p>{data.meta.totalQuestions}+ questions · target role: {data.meta.targetRole}</p>
      </header>

      <section className="controls card">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search question, concept, or tag" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(([key, title]) => <option key={key} value={key}>{title}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">All levels</option>
          {levelOrder.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {typeOrder.map((t) => <option key={t} value={t}>{t === 'all' ? 'All types' : t}</option>)}
        </select>
      </section>

      <div className="layout">
        <aside className="card">
          <h2>Technical Skills Focus</h2>
          {Object.entries(data.technicalSkills).map(([group, skills]) => (
            <div key={group} className="skillGroup">
              <h3>{group}</h3>
              <div className="tags">
                {skills.map((s) => <span key={`${group}-${s}`} className="tag">{s}</span>)}
              </div>
            </div>
          ))}

          <h2>Learning Path</h2>
          <ul>{data.learningPath.map((item) => <li key={item}>{item}</li>)}</ul>

          <h2>Impress the Interviewer</h2>
          <ul>{data.impressInterviewerChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>

        <section>
          <div className="card">
            <h2>Architecture Flows</h2>
            {data.architectureFlows.map((flow) => (
              <div key={flow.title} className="flowWrap">
                <h3>{flow.title}</h3>
                <div className="flow">{flow.steps.map((step) => <div key={step} className="node">{step}</div>)}</div>
                <p className="tip">💡 {flow.tip}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Coding Samples: What to Write</h2>
            {data.codingPlaybooks.map((p) => (
              <details key={p.title} className="question">
                <summary><strong>{p.title}</strong></summary>
                <p>{p.goal}</p>
                <p className="tip">What to write:</p>
                <ul>{p.whatToWrite.map((step) => <li key={`${p.title}-${step}`}>{step}</li>)}</ul>
                <p className="tip">To impress interviewer:</p>
                <ul>{p.impressTips.map((tip) => <li key={`${p.title}-${tip}`}>{tip}</li>)}</ul>
              </details>
            ))}
          </div>

          <div className="card">
            <div className="questionTop">
              <h2>Question Bank ({filtered.length})</h2>
              <button className="pickBtn" onClick={() => setRandomSeed((n) => n + 1)}>Pick Random</button>
            </div>
            {randomQuestion ? (
              <div className="randomBox">
                <small>Random practice prompt</small>
                <p><strong>{randomQuestion.question}</strong></p>
              </div>
            ) : null}

            {filtered.slice(0, 280).map((q) => (
              <details key={q.id} className="question">
                <summary>
                  <span>{q.icon}</span>
                  <span>{q.question}</span>
                  <span className={`pill ${q.level}`}>{q.level}</span>
                </summary>
                <p>{q.answer}</p>
                <div className="tags">{q.tags.map((tag) => <span key={`${q.id}-${tag}`} className="tag">#{tag}</span>)}</div>
              </details>
            ))}
            {filtered.length > 280 ? <p className="tip">Showing first 280 results. Narrow filters to inspect the rest.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
