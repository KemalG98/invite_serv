# date-invite

Mobile invitation mini-site. Open `index.html` directly or serve statically — no build step.

## Local preview

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 on a phone (or browser device toolbar).

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `date-invite`).
2. Push this repo:
   ```bash
   git remote add origin git@github.com:<username>/date-invite.git
   git push -u origin main
   ```
3. In the repo on GitHub: Settings → Pages → Source → select branch `main`, folder `/ (root)` → Save.
4. Wait a minute, then the site is live at:
   `https://<username>.github.io/date-invite/`
