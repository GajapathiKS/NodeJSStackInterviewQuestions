# Interview Mastery (Next.js + 888 Questions)

This project is a **Next.js app** (static export) with a large interview prep bank for beginner-to-expert progression and 2–3 year full-stack interview targeting.

## Features
- 888 interview questions across architecture, coding, theory, debugging, and scenario rounds.
- Search + category + level + type filtering.
- Architecture flow visuals, coding playbooks, learning path, and interviewer-impression checklist.
- GitHub Pages deployment support via **GitHub Actions** or **branch `/docs`**.

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

## Branch-based GitHub Pages (`main` + `/docs`)

If your repository Pages source is configured as **Deploy from a branch** and folder **`/docs`**, generate docs export with:

```bash
npm run build:docs
```

This command rebuilds static output and refreshes `docs/` including `.nojekyll` so Pages does not run Jekyll transforms on Next.js assets.

## GitHub Actions Pages (recommended)
1. In repository settings → Pages, set source to **GitHub Actions**.
2. Workflow `.github/workflows/deploy-pages.yml` builds and deploys from `out/`.
