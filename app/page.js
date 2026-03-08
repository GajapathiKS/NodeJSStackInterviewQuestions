'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import data from '../questions.json';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const CATEGORY_COLORS = [
  '#3b82f6', '#818cf8', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
  '#14b8a6', '#a855f7',
];

const LEVEL_FILTERS = ['all', 'basic', 'intermediate', 'advanced'];
const LEVEL_LABEL   = { all: 'ALL LEVELS', basic: 'BASIC', intermediate: 'INTERMEDIATE', advanced: 'ADVANCED' };
const TYPE_LABEL    = { all: 'ALL TYPES', theory: 'THEORY', coding: 'CODING', architecture: 'ARCHITECTURE', debugging: 'DEBUGGING', scenario: 'SCENARIO' };

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function Page() {
  // ── view state ──────────────────────────────────────────────────────────
  const [view, setView]                     = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [levelFilter, setLevelFilter]       = useState('all');
  const [typeFilter, setTypeFilter]         = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');

  // ── interactive state ────────────────────────────────────────────────────
  const [answered,   setAnswered]   = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [openCards,  setOpenCards]  = useState(new Set());

  // ── flashcard state ──────────────────────────────────────────────────────
  const [fcOpen,     setFcOpen]     = useState(false);
  const [fcQueue,    setFcQueue]    = useState([]);
  const [fcIndex,    setFcIndex]    = useState(0);
  const [fcRevealed, setFcRevealed] = useState(false);

  const searchRef = useRef(null);

  // ── localStorage persistence ─────────────────────────────────────────────
  useEffect(() => {
    const ans = JSON.parse(localStorage.getItem('ip_answered') || '[]');
    const bkm = JSON.parse(localStorage.getItem('ip_bookmarked') || '[]');
    setAnswered(new Set(ans));
    setBookmarked(new Set(bkm));
  }, []);

  useEffect(() => {
    localStorage.setItem('ip_answered', JSON.stringify([...answered]));
  }, [answered]);

  useEffect(() => {
    localStorage.setItem('ip_bookmarked', JSON.stringify([...bookmarked]));
  }, [bookmarked]);

  // ── derived data ─────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const map = new Map();
    data.questions.forEach((q) => {
      if (!map.has(q.category)) {
        map.set(q.category, {
          id:        q.category,
          title:     q.categoryTitle,
          icon:      q.icon,
          color:     CATEGORY_COLORS[map.size % CATEGORY_COLORS.length],
          questions: [],
          types:     new Set(),
        });
      }
      const cat = map.get(q.category);
      cat.questions.push(q);
      cat.types.add(q.type);
    });
    return Array.from(map.values()).map(c => ({ ...c, types: Array.from(c.types) }));
  }, []);

  const categoriesWithProgress = useMemo(() =>
    categories.map(cat => ({
      ...cat,
      answeredCount: cat.questions.filter(q => answered.has(q.id)).length,
    })),
    [categories, answered]
  );

  const activeCategoryData = useMemo(() =>
    categoriesWithProgress.find(c => c.id === activeCategory) || null,
    [categoriesWithProgress, activeCategory]
  );

  const filteredQuestions = useMemo(() => {
    if (!activeCategoryData) return [];
    return activeCategoryData.questions.filter(q =>
      (levelFilter === 'all' || q.level === levelFilter) &&
      (typeFilter  === 'all' || q.type  === typeFilter)
    );
  }, [activeCategoryData, levelFilter, typeFilter]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return data.questions.filter(item =>
      [item.question, item.answer, item.categoryTitle, ...(item.tags ?? [])]
        .join(' ').toLowerCase().includes(q)
    ).slice(0, 150);
  }, [searchQuery]);

  const bookmarkedQuestions = useMemo(() =>
    data.questions.filter(q => bookmarked.has(q.id)),
    [bookmarked]
  );

  const totalAnswered  = answered.size;
  const totalQuestions = data.questions.length;
  const pct            = totalQuestions ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  // ── actions ──────────────────────────────────────────────────────────────
  function toggleAnswered(id) {
    setAnswered(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleBookmarked(id) {
    setBookmarked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleCard(id) {
    setOpenCards(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function goToCategory(id) {
    setActiveCategory(id);
    setLevelFilter('all');
    setTypeFilter('all');
    setOpenCards(new Set());
    setView('category');
    window.scrollTo(0, 0);
  }

  function goHome() {
    setView('home');
    setSearchQuery('');
    window.scrollTo(0, 0);
  }

  function handleSearch(val) {
    setSearchQuery(val);
    if (val.trim()) setView('search');
    else             setView('home');
  }

  function openFlashcards(questions) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setFcQueue(shuffled);
    setFcIndex(0);
    setFcRevealed(false);
    setFcOpen(true);
  }

  function advanceFlashcard(pass) {
    const current = fcQueue[fcIndex];
    if (pass && current && !answered.has(current.id)) toggleAnswered(current.id);
    const next = fcIndex + 1;
    if (next >= fcQueue.length) { setFcOpen(false); return; }
    setFcIndex(next);
    setFcRevealed(false);
  }

  const currentFc = fcQueue[fcIndex] || null;

  // ── shared card props helper ──────────────────────────────────────────────
  function cardProps(q) {
    return {
      isOpen:       openCards.has(q.id),
      isAnswered:   answered.has(q.id),
      isBookmarked: bookmarked.has(q.id),
      onToggle:     () => toggleCard(q.id),
      onAnswer:     () => toggleAnswered(q.id),
      onBookmark:   () => toggleBookmarked(q.id),
    };
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* HEADER */}
      <header className="hdr">
        <div className="hdr-logo" onClick={goHome}>INTERVIEW_PREP.EXE</div>
        <input
          ref={searchRef}
          className="hdr-search"
          placeholder="🔍  Search questions..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
        />
        <div className="hdr-stats">
          <span className="hdr-stat">ANSWERED: <em>{totalAnswered}</em></span>
          <span className="hdr-stat">TOTAL: <em>{totalQuestions}</em></span>
        </div>
      </header>

      <div className="app-layout">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sb-section">
            <div className="sb-label">OVERVIEW</div>
            <div className={`nav-item${view === 'home' ? ' active' : ''}`} onClick={goHome}>
              <span className="nav-ico">🏠</span>
              <span className="nav-title">Dashboard</span>
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-label">CATEGORIES</div>
            {categoriesWithProgress.map(cat => {
              const catPct = cat.questions.length
                ? Math.round((cat.answeredCount / cat.questions.length) * 100)
                : 0;
              const isActive = view === 'category' && activeCategory === cat.id;
              return (
                <div key={cat.id} className="nav-cat-wrap">
                  <div className={`nav-item${isActive ? ' active' : ''}`} onClick={() => goToCategory(cat.id)}>
                    <span className="nav-ico">{cat.icon}</span>
                    <span className="nav-title">{cat.title}</span>
                    <span className="nav-count">{cat.answeredCount}/{cat.questions.length}</span>
                  </div>
                  <div className="nav-prog-bar">
                    <div className="nav-prog-fill" style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sb-section">
            <div className="sb-label">TOOLS</div>
            <div className="nav-item" onClick={() => openFlashcards(data.questions)}>
              <span className="nav-ico">⚡</span>
              <span className="nav-title">Flashcard Mode</span>
            </div>
            <div
              className={`nav-item${view === 'bookmarks' ? ' active' : ''}`}
              onClick={() => { setView('bookmarks'); window.scrollTo(0, 0); }}
            >
              <span className="nav-ico">🔖</span>
              <span className="nav-title">Bookmarks</span>
              {bookmarked.size > 0 && <span className="nav-count">{bookmarked.size}</span>}
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="main">
          {view === 'home' && (
            <HomeView
              categories={categoriesWithProgress}
              totalAnswered={totalAnswered}
              totalQuestions={totalQuestions}
              bookmarkedCount={bookmarked.size}
              pct={pct}
              onCategoryClick={goToCategory}
            />
          )}

          {view === 'search' && (
            <SearchView
              query={searchQuery}
              results={searchResults}
              cardProps={cardProps}
              onBack={goHome}
            />
          )}

          {view === 'category' && activeCategoryData && (
            <CategoryView
              cat={activeCategoryData}
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              filteredQuestions={filteredQuestions}
              cardProps={cardProps}
              onBack={goHome}
              onFlashcards={openFlashcards}
            />
          )}

          {view === 'bookmarks' && (
            <BookmarksView
              questions={bookmarkedQuestions}
              cardProps={cardProps}
              onBack={goHome}
            />
          )}
        </main>
      </div>

      {/* FLASHCARD FAB */}
      <button className="fc-fab" onClick={() => openFlashcards(data.questions)}>
        ⚡ FLASHCARD MODE
      </button>

      {/* FLASHCARD MODAL */}
      {fcOpen && currentFc && (
        <div className="modal-overlay" onClick={() => setFcOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setFcOpen(false)}>✕ close</button>
            <h2>⚡ Flashcard Mode</h2>
            <p>Click the card to reveal the answer. Mark pass/fail to track retention.</p>

            <div className="fc-cat-label">{currentFc.categoryTitle}</div>

            <div
              className={`flashcard${fcRevealed ? ' revealed' : ''}`}
              onClick={() => setFcRevealed(true)}
            >
              <div className="fc-meta">
                <span className={`level-badge ${currentFc.level}`}>{currentFc.level}</span>
                {' '}
                <span className="type-badge">{currentFc.type}</span>
              </div>
              <div className="fc-q">{currentFc.question}</div>
              <div className="fc-a" dangerouslySetInnerHTML={{ __html: currentFc.answer }} />
            </div>

            <div className="fc-hint">{fcRevealed ? '' : 'tap to reveal answer'}</div>

            <div className="fc-nav">
              <button className="fc-btn fail" onClick={() => advanceFlashcard(false)}>✕ Need Practice</button>
              <button className="fc-btn pass" onClick={() => advanceFlashcard(true)}>✓ Got It</button>
            </div>
            <div className="fc-counter">{fcIndex + 1} / {fcQueue.length}</div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────

function HomeView({ categories, totalAnswered, totalQuestions, bookmarkedCount, pct, onCategoryClick }) {
  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">// INTERVIEW PREPARATION</div>
        <div className="hero-title">Full Stack <span>Interview</span><br />Mastery Kit</div>
        <div className="hero-sub">
          {totalQuestions}+ questions across architecture, coding, theory, debugging &amp; scenarios.
          From absolute basics to system design — every topic mapped.
        </div>
        <div className="hero-chips">
          {data.meta.focusAreas.map(area => (
            <span key={area} className="chip">{area}</span>
          ))}
        </div>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="tracker-panel">
        <div className="tracker-title">// PROGRESS TRACKER</div>
        <div className="tracker-stats">
          <div className="tracker-stat">
            <div className="tracker-num" style={{ color: 'var(--green)' }}>{totalAnswered}</div>
            <div className="tracker-label">Answered</div>
          </div>
          <div className="tracker-stat">
            <div className="tracker-num" style={{ color: 'var(--yellow)' }}>{bookmarkedCount}</div>
            <div className="tracker-label">Bookmarked</div>
          </div>
          <div className="tracker-stat">
            <div className="tracker-num">{totalQuestions}</div>
            <div className="tracker-label">Total</div>
          </div>
          <div className="tracker-stat">
            <div className="tracker-num" style={{ color: 'var(--accent)' }}>{pct}%</div>
            <div className="tracker-label">Complete</div>
          </div>
        </div>
        <div className="overall-bar">
          <div className="overall-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="cat-grid">
        {categories.map(cat => {
          const catPct = cat.questions.length
            ? Math.round((cat.answeredCount / cat.questions.length) * 100)
            : 0;
          return (
            <div
              key={cat.id}
              className="cat-card"
              style={{ '--cat-color': cat.color }}
              onClick={() => onCategoryClick(cat.id)}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-title">{cat.title}</div>
              <div className="cat-types">{cat.types.join(' · ')}</div>
              <div className="cat-meta">
                <span
                  className="cat-q-count"
                  style={{ background: cat.color + '22', color: cat.color }}
                >
                  {cat.questions.length} Q
                </span>
                <div className="cat-prog">
                  <div className="cat-prog-fill" style={{ width: `${catPct}%`, background: cat.color }} />
                </div>
                <span className="cat-ans-count">{cat.answeredCount}/{cat.questions.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CATEGORY VIEW ────────────────────────────────────────────────────────────

function CategoryView({
  cat, levelFilter, setLevelFilter, typeFilter, setTypeFilter,
  filteredQuestions, cardProps, onBack, onFlashcards,
}) {
  const types = useMemo(() => Array.from(new Set(cat.questions.map(q => q.type))), [cat]);

  return (
    <div>
      <div className="section-header">
        <div className="back-btn" onClick={onBack}>← Back to Dashboard</div>
        <div className="section-title">{cat.icon} {cat.title}</div>
        <div className="section-desc">
          {cat.questions.length} questions &nbsp;·&nbsp; {cat.answeredCount} answered
        </div>
      </div>

      <button className="fc-cat-btn" onClick={() => onFlashcards(cat.questions)}>
        ⚡ FLASHCARDS FOR THIS CATEGORY
      </button>

      {/* LEVEL FILTERS */}
      <div className="filters">
        {LEVEL_FILTERS.map(lv => (
          <button
            key={lv}
            className={`filter-btn lv-${lv}${levelFilter === lv ? ' active' : ''}`}
            onClick={() => setLevelFilter(lv)}
          >
            {LEVEL_LABEL[lv]}
          </button>
        ))}
        <div className="filter-divider" />
        {types.map(t => (
          <button
            key={t}
            className={`filter-btn${typeFilter === t ? ' active' : ''}`}
            onClick={() => setTypeFilter(prev => prev === t ? 'all' : t)}
          >
            {TYPE_LABEL[t] || t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="filter-count">
        SHOWING {filteredQuestions.length} OF {cat.questions.length} QUESTIONS
      </div>

      {filteredQuestions.map((q, i) => (
        <QuestionCard key={q.id} q={q} num={i + 1} {...cardProps(q)} />
      ))}

      {filteredQuestions.length === 0 && (
        <div className="empty-state">No questions match the current filters.</div>
      )}
    </div>
  );
}

// ─── SEARCH VIEW ──────────────────────────────────────────────────────────────

function SearchView({ query, results, cardProps, onBack }) {
  return (
    <div>
      <div className="section-header">
        <div className="back-btn" onClick={onBack}>← Back</div>
        <div className="section-title">Search Results</div>
        <div className="section-desc">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </div>
      </div>

      {results.length === 0 && (
        <div className="empty-state">No questions found. Try different keywords.</div>
      )}

      {results.map((q, i) => (
        <QuestionCard key={q.id} q={q} num={i + 1} {...cardProps(q)} />
      ))}
    </div>
  );
}

// ─── BOOKMARKS VIEW ───────────────────────────────────────────────────────────

function BookmarksView({ questions, cardProps, onBack }) {
  return (
    <div>
      <div className="section-header">
        <div className="back-btn" onClick={onBack}>← Back</div>
        <div className="section-title">🔖 Bookmarked Questions</div>
        <div className="section-desc">{questions.length} bookmarked</div>
      </div>

      {questions.length === 0 && (
        <div className="empty-state">
          No bookmarks yet.{'\n'}Use the 🔖 button on any question to save it here.
        </div>
      )}

      {questions.map((q, i) => (
        <QuestionCard key={q.id} q={q} num={i + 1} {...cardProps(q)} />
      ))}
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────

function QuestionCard({ q, num, isOpen, isAnswered, isBookmarked, onToggle, onAnswer, onBookmark }) {
  return (
    <div className={`q-card${isAnswered ? ' answered' : ''}${isBookmarked ? ' bookmarked' : ''}`}>
      <div className="q-hdr" onClick={onToggle}>
        <span className="q-num">#{num}</span>
        <span className="q-text">{q.question}</span>
        <div className="q-badges">
          <span className={`level-badge ${q.level}`}>{q.level}</span>
          <span className="type-badge">{q.type}</span>
        </div>
        <div className="q-actions" onClick={e => e.stopPropagation()}>
          <button className={`q-btn${isAnswered ? ' done' : ''}`} onClick={onAnswer} title="Mark as answered">
            {isAnswered ? '✓' : '✓ Done'}
          </button>
          <button className={`q-btn${isBookmarked ? ' bkd' : ''}`} onClick={onBookmark} title="Bookmark">
            🔖
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="q-answer">
          <div
            className="answer-box"
            dangerouslySetInnerHTML={{ __html: q.answer }}
          />
          {q.tags && q.tags.length > 0 && (
            <div className="q-tags">
              {q.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
