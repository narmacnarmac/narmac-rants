# Sports Rants — Dolphins & Wizards (Static Site)

A zero-backend, static blog for sharp, opinionated rants on the Miami Dolphins and Washington Wizards.
Built with vanilla HTML/CSS/JS (Tailwind via CDN), posts in JSON, and a tiny hash router.

## Quick Start

1) **Download** this folder and push it to a new GitHub repo.
2) **Deploy** any static host: GitHub Pages, Netlify, or Vercel.
   - **GitHub Pages**: Settings → Pages → Deploy from `/ (root)` or `/docs` if you move files.
   - **Netlify**: Drag-drop the folder onto the Netlify dashboard.
   - **Vercel**: Create a new project → import the repo (framework: Other/Static).

3) **Custom Domain (optional)**: Point DNS `A`/`CNAME` to your host. Add a `CNAME` file with your domain if using Pages.

4) **Analytics (optional)**: Uncomment Plausible (or insert GA).

5) **Newsletter (optional)**: Replace the Buttondown action URL with your list provider.

## Add a Post

Open `data/posts.json` and append an object:

```jsonc
{
  "title": "Your headline",
  "subtitle": "Optional subhead",
  "date": "2025-10-27",
  "tags": ["Dolphins"], // or ["Wizards", "NBA"]
  "slug": "your-headline-slug",
  "body": "# Markdown-like\nWrite your rant here."
}
```

- The site sorts by `date` (newest first).
- Minimal Markdown is supported: `#`/`##`/`###`, **bold**, *italic*, lists, and ``` code fences.
- Slug must be unique.

## Manual Stats Widgets

Update `stats/dolphins.json` and `stats/wizards.json` after each game to surface a quick scoreboard and note.
Later we can wire live data (paid: Sportradar, SportsDataIO; free: community APIs with limits).

## Editing Locally

Just open `index.html` in a browser. For local fetch to work, serve a tiny static server:

- **Python**: `python3 -m http.server 8000` then visit http://localhost:8000
- **Node**: `npx serve`

## Structure

```
/assets         # images, favicon
/data/posts.json
/js/app.js      # router, renderer, markdown-ish
/stats/*.json   # manual game summaries
index.html
```

## Roadmap Ideas

- RSS feed generation (small Node script to emit `feed.xml` from `posts.json`).
- Comments (Giscus) — requires a GitHub repo.
- Dark mode toggle.
- Tag pages and archive.
- API wiring to live stats with rate-limit handling + caching JSON in repo.
- CI: Prettier & link-checker on PRs.

---

If you want a full Next.js + MDX stack with CMS (Sanity/Notion/Ghost), we can scaffold that next.
