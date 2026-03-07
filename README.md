# Interview Mastery (Next.js + 550 Questions)

This project is now a **Next.js app** (static export) with a large interview prep bank for beginner-to-expert progression.

## Features
- 550 interview questions across multiple Node/JS/full-stack categories.
- Search + category + level filtering.
- Architecture flow visuals with explanation tips.
- Learning path and interviewer-impression checklist.
- GitHub Pages deployment via GitHub Actions.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Production build (static export)

```bash
npm run build
# static files generated in ./out
```

## GitHub Pages
1. Push to `main`.
2. In repo settings → Pages, set source to **GitHub Actions**.
3. Workflow at `.github/workflows/deploy-pages.yml` builds and deploys the `out/` folder.
