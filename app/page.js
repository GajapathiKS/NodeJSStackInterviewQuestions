'use client';

import { useMemo, useState } from 'react';
import data from '../questions.json';

const levelOrder = ['basic', 'intermediate', 'advanced'];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const categories = useMemo(() => {
    const map = new Map();
    data.questions.forEach((q) => {
      map.set(q.category, q.categoryTitle);
    });
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.questions.filter((item) => {
      const searchable = [item.question, item.answer, item.categoryTitle, ...item.tags].join(' ').toLowerCase();
      const matchesQuery = !q || searchable.includes(q);
      const matchesCategory = category === 'all' || item.category === category;
      const matchesLevel = level === 'all' || item.level === level;
      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [query, category, level]);

  return (
    <main className="page">
      <header className="topBar">
        <h1>🚀 Interview Mastery UI (Next.js)</h1>
        <p>{data.meta.totalQuestions}+ questions · beginner to expert</p>
      </header>

      <section className="controls card">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search question, concept, or tag"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(([key, title]) => (
            <option key={key} value={key}>
              {title}
            </option>
          ))}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">All levels</option>
          {levelOrder.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </select>
      </section>

      <div className="layout">
        <aside className="card">
          <h2>Learning Path</h2>
          <ul>
            {data.learningPath.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>Impress the Interviewer</h2>
          <ul>
            {data.impressInterviewerChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>

        <section>
          <div className="card">
            <h2>Architecture Flows</h2>
            {data.architectureFlows.map((flow) => (
              <div key={flow.title} className="flowWrap">
                <h3>{flow.title}</h3>
                <div className="flow">
                  {flow.steps.map((step) => (
                    <div key={step} className="node">
                      {step}
                    </div>
                  ))}
                </div>
                <p className="tip">💡 {flow.tip}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Question Bank ({filtered.length})</h2>
            {filtered.slice(0, 250).map((q) => (
              <details key={q.id} className="question">
                <summary>
                  <span>{q.icon}</span>
                  <span>{q.question}</span>
                  <span className={`pill ${q.level}`}>{q.level}</span>
                </summary>
                <p>{q.answer}</p>
                <div className="tags">
                  {q.tags.map((tag) => (
                    <span key={`${q.id}-${tag}`} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </details>
            ))}
            {filtered.length > 250 ? (
              <p className="tip">Showing first 250 results. Narrow filters to inspect the rest.</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
