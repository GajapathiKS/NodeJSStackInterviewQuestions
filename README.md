# Interview Mastery UI (550+ Questions)

A static GitHub Pages app focused on beginner-to-expert interview prep:
- 550 curated questions across Node.js, JavaScript, backend, databases, architecture, frontend/Next.js, and full-stack coding.
- Graphical architecture flow cards for explaining system design in interviews.
- Beginner learning path and "impress the interviewer" checklist.
- Search + filter by category and level.

## Local run

```bash
python -m http.server 4173
# open http://localhost:4173
```

## Deploy to GitHub Pages

1. Push to `main` branch.
2. In repository settings, enable **Pages** and set source to **GitHub Actions**.
3. Workflow `.github/workflows/deploy-pages.yml` deploys the static site.

After deployment, your app is available at:

`https://<your-github-username>.github.io/<repo-name>/`
