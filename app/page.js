'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
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

// ─── TECH STACK DETECTION ────────────────────────────────────────────────────
const TECH_MAP = [
  { tech: 'React',          match: ['react', 'jsx', 'hooks', 'context-vs-state', 'error-boundaries', 'ssr-vs-csr', 'hydration', 'code-splitting', 'component-composition'] },
  { tech: 'Angular',        match: ['angular', 'signals', 'change-detection', 'angular-material'] },
  { tech: 'TypeScript',     match: ['typescript', 'type-narrowing', 'generics', 'utility-types', 'decorators', 'ts-config', 'type-safe', 'compile-time'] },
  { tech: 'JavaScript',     match: ['javascript', 'js', 'es6', 'closures', 'promises', 'async-await', 'event-loop', 'big-o-in-js', 'solid-in-js'] },
  { tech: 'Node.js',        match: ['node', 'express', 'fastify', 'middleware', 'background-workers', 'file-streaming'] },
  { tech: 'CSS',            match: ['css', 'flexbox', 'grid', 'responsive', 'dark-mode', 'animation', 'cross-browser', 'semantic-html', 'design-system'] },
  { tech: 'Tailwind',       match: ['tailwind'] },
  { tech: 'PostgreSQL',     match: ['postgresql', 'postgres', 'indexes', 'query-plans', 'transactions', 'isolation-levels', 'read-replicas'] },
  { tech: 'MongoDB',        match: ['mongodb', 'mongo', 'mongoose', 'aggregation'] },
  { tech: 'Prisma',         match: ['prisma'] },
  { tech: 'Docker',         match: ['docker', 'dockerfile', 'multi-stage-build', 'container'] },
  { tech: 'GitHub Actions', match: ['github-actions', 'caching-in-ci'] },
  { tech: 'Git',            match: ['git-branching', 'pr-review'] },
  { tech: 'Jest',           match: ['jest'] },
  { tech: 'Playwright',     match: ['playwright'] },
  { tech: 'REST',           match: ['rest', 'api-gateway', 'api-versioning', 'http-semantics'] },
  { tech: 'JWT',            match: ['jwt', 'refresh-tokens', 'auth'] },
  { tech: 'WebSocket',      match: ['socket', 'realtime-chat', 'realtime'] },
  { tech: 'AI/LLM',         match: ['prompt', 'few-shot', 'hallucination', 'tool-calling', 'context-window', 'retrieval', 'pii-redaction', 'model-fallback', 'latency-budget', 'cost-control', 'human-in-the-loop', 'evaluation-metrics'] },
  { tech: 'Vercel',         match: ['vercel'] },
  { tech: 'Cloudinary',     match: ['cloudinary'] },
  { tech: 'Postman',        match: ['postman'] },
  { tech: 'VS Code',        match: ['vs-code'] },
  { tech: 'shadcn/ui',      match: ['shadcn'] },
];

function detectTechStack(q) {
  const text = [q.question, ...(q.tags || [])].join(' ').toLowerCase();
  const techs = [];
  for (const { tech, match } of TECH_MAP) {
    if (match.some(m => text.includes(m))) techs.push(tech);
  }
  return techs;
}

// Pre-compute tech stacks for all questions
const QUESTION_TECH = new Map();
data.questions.forEach(q => { QUESTION_TECH.set(q.id, detectTechStack(q)); });

// ─── INSPIRATIONAL QUOTES ────────────────────────────────────────────────────
const QUOTES = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'Believe you can and you are halfway there.', author: 'Theodore Roosevelt' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Your limitation — it is only your imagination.', author: 'Unknown' },
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'Great things never come from comfort zones.', author: 'Unknown' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'The harder you work for something, the greater you will feel when you achieve it.', author: 'Unknown' },
  { text: 'Do not wait for opportunity. Create it.', author: 'George Bernard Shaw' },
  { text: 'Sometimes later becomes never. Do it now.', author: 'Unknown' },
  { text: 'Knowledge is power.', author: 'Francis Bacon' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Programming is not about typing, it is about thinking.', author: 'Rich Hickey' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Perfection is not attainable, but if we chase perfection we can catch excellence.', author: 'Vince Lombardi' },
  { text: 'What we know is a drop, what we do not know is an ocean.', author: 'Isaac Newton' },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates' },
  { text: 'Genius is one percent inspiration and ninety-nine percent perspiration.', author: 'Thomas Edison' },
  { text: 'The mind is not a vessel to be filled, but a fire to be kindled.', author: 'Plutarch' },
  { text: 'Try not to become a man of success. Rather become a man of value.', author: 'Albert Einstein' },
  { text: 'I have not failed. I have just found 10,000 ways that will not work.', author: 'Thomas Edison' },
  { text: 'Whether you think you can or you think you cannot, you are right.', author: 'Henry Ford' },
  { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'Everything you have ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis' },
  { text: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein' },
  { text: 'You are never too old to set another goal or to dream a new dream.', author: 'C.S. Lewis' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Small daily improvements over time lead to stunning results.', author: 'Robin Sharma' },
  { text: 'Do not let what you cannot do interfere with what you can do.', author: 'John Wooden' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { text: 'Opportunities do not happen. You create them.', author: 'Chris Grosser' },
  { text: 'It is not that I am so smart, it is just that I stay with problems longer.', author: 'Albert Einstein' },
  { text: 'Be not afraid of going slowly; be afraid only of standing still.', author: 'Chinese Proverb' },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'There is no substitute for hard work.', author: 'Thomas Edison' },
  { text: 'What you do today can improve all your tomorrows.', author: 'Ralph Marston' },
  { text: 'Knowing is not enough; we must apply. Wishing is not enough; we must do.', author: 'Johann Wolfgang von Goethe' },
  { text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb' },
  { text: 'Your time is limited, do not waste it living someone else\'s life.', author: 'Steve Jobs' },
  { text: 'Be the change that you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'Nothing is impossible. The word itself says I am possible.', author: 'Audrey Hepburn' },
  { text: 'Keep your face always toward the sunshine and shadows will fall behind you.', author: 'Walt Whitman' },
  { text: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius' },
  { text: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
  { text: 'We may encounter many defeats but we must not be defeated.', author: 'Maya Angelou' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
  { text: 'With self-discipline most anything is possible.', author: 'Theodore Roosevelt' },
  { text: 'Persistence guarantees that results are inevitable.', author: 'Paramahansa Yogananda' },
  { text: 'The more I read, the more I acquire, the more certain I am that I know nothing.', author: 'Voltaire' },
  { text: 'In learning you will teach, and in teaching you will learn.', author: 'Phil Collins' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
  { text: 'Develop a passion for learning. If you do, you will never cease to grow.', author: 'Anthony J. D\'Angelo' },
  { text: 'You do not have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
  { text: 'Our greatest weakness lies in giving up. The most certain way to succeed is to try just one more time.', author: 'Thomas Edison' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Life is 10% what happens to us and 90% how we react to it.', author: 'Charles R. Swindoll' },
  { text: 'Continuous learning is the minimum requirement for success in any field.', author: 'Brian Tracy' },
  { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
  { text: 'I am still learning.', author: 'Michelangelo' },
  { text: 'The more that you read, the more things you will know. The more that you learn, the more places you will go.', author: 'Dr. Seuss' },
  { text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats' },
  { text: 'The purpose of learning is growth, and our minds, unlike our bodies, can continue growing as we continue to live.', author: 'Mortimer Adler' },
  { text: 'Never let formal education get in the way of your learning.', author: 'Mark Twain' },
  { text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.', author: 'Benjamin Franklin' },
  { text: 'The day you stop learning is the day you stop living.', author: 'Albert Einstein' },
  { text: 'Every master was once a disaster.', author: 'T. Harv Eker' },
  { text: 'Progress is impossible without change, and those who cannot change their minds cannot change anything.', author: 'George Bernard Shaw' },
  { text: 'Courage is not having the strength to go on; it is going on when you do not have the strength.', author: 'Theodore Roosevelt' },
  { text: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill' },
  { text: 'Wisdom is not a product of schooling but of the lifelong attempt to acquire it.', author: 'Albert Einstein' },
  { text: 'The biggest risk is not taking any risk.', author: 'Mark Zuckerberg' },
  { text: 'Do not be embarrassed by your failures, learn from them and start again.', author: 'Richard Branson' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'There are no shortcuts to any place worth going.', author: 'Beverly Sills' },
  { text: 'Tough times never last, but tough people do.', author: 'Robert H. Schuller' },
  { text: 'The only way to learn a new programming language is by writing programs in it.', author: 'Dennis Ritchie' },
  { text: 'Software is a great combination between artistry and engineering.', author: 'Bill Gates' },
  { text: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.', author: 'Bill Gates' },
  { text: 'Java is to JavaScript what car is to carpet.', author: 'Chris Heilmann' },
  { text: 'Before software can be reusable it first has to be usable.', author: 'Ralph Johnson' },
  { text: 'Good code is its own best documentation.', author: 'Steve McConnell' },
];

// ─── CODE EDITOR HELPERS ─────────────────────────────────────────────────────
const CODE_THEMES = [
  { id: 'vs-dark',  label: 'Dark' },
  { id: 'vs',       label: 'Light' },
  { id: 'hc-black', label: 'High Contrast' },
];

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function detectLanguage(code) {
  const t = code.trim();
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/im.test(t)) return 'sql';
  if (/^FROM\s+\w+/m.test(t) && /\b(RUN|COPY|CMD|EXPOSE|WORKDIR)\b/.test(t)) return 'dockerfile';
  if (/^\s*<(!DOCTYPE|html|div|span|table|p\b)/im.test(t)) return 'html';
  if (/^\s*[\w-]+\s*\{[\s\S]*\}/m.test(t) && /[\w-]+\s*:\s*[^;]+;/.test(t)) return 'css';
  if (/^\s*\w+:/m.test(t) && !/[{};]/.test(t)) return 'yaml';
  return 'typescript';
}

function splitAnswerHtml(html) {
  const segments = [];
  const preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
  let lastIndex = 0;
  let match;
  while ((match = preRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'html', content: html.slice(lastIndex, match.index) });
    }
    let code = match[1];
    code = code.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '$1');
    code = decodeEntities(code);
    // Trim trailing newline
    if (code.endsWith('\n')) code = code.slice(0, -1);
    segments.push({ type: 'code', content: code, lang: detectLanguage(code) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    segments.push({ type: 'html', content: html.slice(lastIndex) });
  }
  return segments;
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function Page() {
  // ── view state ──────────────────────────────────────────────────────────
  const [view, setView]                     = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [levelFilter, setLevelFilter]       = useState('all');
  const [typeFilter, setTypeFilter]         = useState('all');
  const [techFilter, setTechFilter]         = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');

  // ── theme state ─────────────────────────────────────────────────────────
  const [theme, setTheme] = useState('dark');
  const [codeTheme, setCodeTheme] = useState('vs-dark');

  // ── interactive state ────────────────────────────────────────────────────
  const [answered,   setAnswered]   = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [openCards,  setOpenCards]  = useState(new Set());

  // ── quote tooltip state ─────────────────────────────────────────────
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [quoteFrequency, setQuoteFrequency] = useState(20);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const quoteShownCountRef = useRef(0);
  const quoteFreqRef = useRef(20);

  // ── flashcard state ──────────────────────────────────────────────────────
  const [fcOpen,     setFcOpen]     = useState(false);
  const [fcQueue,    setFcQueue]    = useState([]);
  const [fcIndex,    setFcIndex]    = useState(0);
  const [fcRevealed, setFcRevealed] = useState(false);

  const searchRef = useRef(null);
  const loadedRef = useRef(false);

  // ── load from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    const ans = JSON.parse(localStorage.getItem('ip_answered') || '[]');
    const bkm = JSON.parse(localStorage.getItem('ip_bookmarked') || '[]');
    setAnswered(new Set(ans));
    setBookmarked(new Set(bkm));
    const saved = localStorage.getItem('ip_theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    const savedCode = localStorage.getItem('ip_code_theme') || 'vs-dark';
    setCodeTheme(savedCode);
    const savedFreq = parseInt(localStorage.getItem('ip_quote_freq') || '20', 10);
    setQuoteFrequency(savedFreq);
    quoteFreqRef.current = savedFreq;
    // Mark loaded so save effects below don't fire before data is restored
    loadedRef.current = true;
  }, []);

  // ── save to localStorage on change (skip until loaded) ─────────────────
  useEffect(() => {
    if (loadedRef.current) localStorage.setItem('ip_answered', JSON.stringify([...answered]));
  }, [answered]);

  useEffect(() => {
    if (loadedRef.current) localStorage.setItem('ip_bookmarked', JSON.stringify([...bookmarked]));
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
      (typeFilter  === 'all' || q.type  === typeFilter) &&
      (techFilter  === 'all' || (QUESTION_TECH.get(q.id) || []).includes(techFilter))
    );
  }, [activeCategoryData, levelFilter, typeFilter, techFilter]);

  const searchResults = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    if (!raw) return [];
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const stripHtml = s => s.replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ');

    const scored = [];
    for (const item of data.questions) {
      const title    = (item.question || '').toLowerCase();
      const tags     = (item.tags ?? []).join(' ').toLowerCase();
      const category = (item.categoryTitle || '').toLowerCase();
      const answer   = stripHtml(item.answer || '').toLowerCase();

      // Every word must appear in at least one field
      const allMatch = words.every(w =>
        title.includes(w) || tags.includes(w) || category.includes(w) || answer.includes(w)
      );
      if (!allMatch) continue;

      // Relevance scoring: title > tags > category > answer
      let score = 0;
      for (const w of words) {
        if (title.includes(w))    score += 10;
        if (tags.includes(w))     score += 5;
        if (category.includes(w)) score += 3;
        if (answer.includes(w))   score += 1;
      }
      // Bonus for exact phrase match in title
      if (title.includes(raw)) score += 20;

      scored.push({ item, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 150).map(s => s.item);
  }, [searchQuery]);

  const bookmarkedQuestions = useMemo(() =>
    data.questions.filter(q => bookmarked.has(q.id)),
    [bookmarked]
  );

  const totalAnswered  = answered.size;
  const totalQuestions = data.questions.length;
  const pct            = totalQuestions ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  // ── actions ──────────────────────────────────────────────────────────────
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    const effect = next === 'light' ? 'sunrise' : 'moonrise';

    // Create overlay for gradient wash
    const overlay = document.createElement('div');
    overlay.className = `theme-transition-overlay ${effect}`;
    document.body.appendChild(overlay);

    // Create celestial body (sun or moon SVG)
    const celestial = document.createElement('div');
    celestial.className = `celestial-body ${effect}`;
    if (next === 'light') {
      // Realistic sun sphere with warm glow + animated rays
      celestial.innerHTML = `
        <div class="sun-sphere"></div>
        <div class="sun-rays"></div>
      `;
    } else {
      // Realistic moon (CodePen-inspired) with twinkling stars
      celestial.innerHTML = `
        <div class="moon-sphere"></div>
        <span class="moon-star"></span>
        <span class="moon-star"></span>
        <span class="moon-star"></span>
        <span class="moon-star"></span>
        <span class="moon-star"></span>
        <span class="moon-star"></span>
        <span class="moon-star"></span>
      `;
    }
    document.body.appendChild(celestial);

    // Add smooth transition class
    document.body.classList.add('theme-transitioning');

    // Switch theme midway through the animation
    setTimeout(() => {
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ip_theme', next);
    }, 400);

    // Clean up after animation
    setTimeout(() => {
      overlay.remove();
      celestial.remove();
      document.body.classList.remove('theme-transitioning');
    }, 1350);
  }

  function changeCodeTheme(id) {
    setCodeTheme(id);
    localStorage.setItem('ip_code_theme', id);
  }

  function toggleAnswered(id) {
    setAnswered(prev => {
      const n = new Set(prev);
      const wasDone = n.has(id);
      wasDone ? n.delete(id) : n.add(id);
      // Show quote every N questions marked done
      if (!wasDone) {
        quoteShownCountRef.current += 1;
        const freq = quoteFreqRef.current;
        if (freq > 0 && quoteShownCountRef.current % freq === 0) {
          showRandomQuote();
        }
      }
      return n;
    });
  }
  function toggleBookmarked(id) {
    setBookmarked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function showRandomQuote() {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setCurrentQuote(q);
    setQuoteVisible(true);
    setTimeout(() => setQuoteVisible(false), 6000);
  }

  function toggleCard(id) {
    setOpenCards(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function goToCategory(id) {
    setActiveCategory(id);
    setLevelFilter('all');
    setTypeFilter('all');
    setTechFilter('all');
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
    if (val.trim()) {
      setView('search');
      window.scrollTo({ top: 0 });
    } else {
      setView('home');
    }
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
      codeTheme,
      onCodeThemeChange: changeCodeTheme,
    };
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* HEADER */}
      <header className="hdr">
        <div className="hdr-logo" onClick={goHome}>INTERVIEW_PREP.EXE</div>
        <div className="hdr-search-wrap">
          <input
            ref={searchRef}
            className="hdr-search"
            placeholder="🔍  Search questions..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => handleSearch('')} title="Clear search">✕</button>
          )}
        </div>
        <div className="hdr-stats">
          <span className="hdr-stat">ANSWERED: <em>{totalAnswered}</em></span>
          <span className="hdr-stat">TOTAL: <em>{totalQuestions}</em></span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="settings-wrap">
          <button className="settings-btn" onClick={() => setSettingsOpen(p => !p)} title="Settings">
            ⚙️
          </button>
          {settingsOpen && (
            <div className="settings-panel">
              <div className="settings-title">Settings</div>
              <div className="settings-row">
                <label className="settings-label">Quote every</label>
                <select
                  className="settings-select"
                  value={quoteFrequency}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10);
                    setQuoteFrequency(v);
                    quoteFreqRef.current = v;
                    localStorage.setItem('ip_quote_freq', String(v));
                  }}
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={20}>20 questions</option>
                  <option value={50}>50 questions</option>
                  <option value={100}>100 questions</option>
                  <option value={0}>Off</option>
                </select>
              </div>
              <button className="settings-test-btn" onClick={showRandomQuote}>
                ✨ Test Quote
              </button>
            </div>
          )}
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
              techFilter={techFilter}
              setTechFilter={setTechFilter}
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

      {/* FLOATING ACTIONS */}
      <button className="scroll-top-fab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Scroll to top">
        ↑
      </button>
      <button className="fc-fab" onClick={() => openFlashcards(data.questions)}>
        ⚡ FLASHCARD MODE
      </button>

      {/* INSPIRATIONAL QUOTE TOOLTIP */}
      {quoteVisible && currentQuote && (
        <div className={`quote-tooltip${quoteVisible ? ' show' : ''}`}>
          <div className="quote-icon">&#10024;</div>
          <p className="quote-text">&ldquo;{currentQuote.text}&rdquo;</p>
          <span className="quote-author">— {currentQuote.author}</span>
          <button className="quote-close" onClick={() => setQuoteVisible(false)}>&#10005;</button>
        </div>
      )}

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
        <div className="hero-tag">// YOUR INTERVIEW JOURNEY STARTS HERE</div>
        <div className="hero-title">Crack Any <span>Full Stack</span><br />Interview</div>
        <div className="hero-sub">
          {totalQuestions}+ curated questions for developers with 2–6 years of experience.
          Covers React, Angular, TypeScript, Node.js, PostgreSQL, MongoDB, Docker, CI/CD, testing, system design &amp; more —
          from fundamentals to advanced architecture. Practice by category, track your progress, and walk in confident.
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
  techFilter, setTechFilter,
  filteredQuestions, cardProps, onBack, onFlashcards,
}) {
  const types = useMemo(() => Array.from(new Set(cat.questions.map(q => q.type))), [cat]);

  const techTags = useMemo(() => {
    const tagCount = new Map();
    cat.questions.forEach(q => (QUESTION_TECH.get(q.id) || []).forEach(t => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
    return [...tagCount.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [cat]);

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

      {/* TECH STACK FILTER */}
      {techTags.length > 0 && (
        <div className="tech-filter-row">
          <button
            className={`tech-pill${techFilter === 'all' ? ' active' : ''}`}
            onClick={() => setTechFilter('all')}
          >ALL TOPICS</button>
          {techTags.map(t => (
            <button
              key={t}
              className={`tech-pill${techFilter === t ? ' active' : ''}`}
              onClick={() => setTechFilter(prev => prev === t ? 'all' : t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

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

// ─── MONACO CODE BLOCK ───────────────────────────────────────────────────────

function MonacoCodeBlock({ code, lang, theme, onThemeChange }) {
  const [copied, setCopied] = useState(false);
  const lineCount = code.split('\n').length;
  const height = Math.min(lineCount * 19 + 16, 500);

  return (
    <div className="code-editor">
      <div className="code-toolbar">
        <div className="code-dots"><span /><span /><span /></div>
        <span className="code-lang">{lang.toUpperCase()}</span>
        <div className="code-theme-pills">
          {CODE_THEMES.map(t => (
            <button
              key={t.id}
              className={`code-theme-btn${theme === t.id ? ' active' : ''}`}
              onClick={() => onThemeChange(t.id)}
            >{t.label}</button>
          ))}
        </div>
        <button className="code-copy" onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <Editor
        height={height}
        defaultLanguage={lang}
        defaultValue={code}
        theme={theme}
        loading={<div className="code-loading">Loading editor...</div>}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          fontSize: 13,
          fontFamily: "'Space Mono', monospace",
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: 'hidden', horizontal: 'auto', horizontalScrollbarSize: 6 },
          folding: false,
          contextmenu: false,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────

function QuestionCard({ q, num, isOpen, isAnswered, isBookmarked, onToggle, onAnswer, onBookmark, codeTheme, onCodeThemeChange }) {
  const techPills = QUESTION_TECH.get(q.id) || [];

  const segments = useMemo(() => {
    if (!isOpen) return [];
    return splitAnswerHtml(q.answer || '');
  }, [isOpen, q.answer]);

  return (
    <div className={`q-card${isAnswered ? ' answered' : ''}${isBookmarked ? ' bookmarked' : ''}`}>
      <div className="q-hdr" onClick={onToggle}>
        <span className="q-num">#{num}</span>
        <span className="q-text">{q.question}</span>
        <div className="q-badges">
          <span className={`level-badge ${q.level}`}>{q.level}</span>
          <span className="type-badge">{q.type}</span>
          {techPills.slice(0, 3).map(t => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
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
          <div className="answer-box">
            {segments.map((seg, i) =>
              seg.type === 'html'
                ? <div key={i} dangerouslySetInnerHTML={{ __html: seg.content }} />
                : <MonacoCodeBlock key={i} code={seg.content} lang={seg.lang} theme={codeTheme} onThemeChange={onCodeThemeChange} />
            )}
          </div>
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
