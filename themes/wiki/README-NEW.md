Wiki theme (adapted from Occasio)

Overview
- This is a documentation/wiki-focused theme created by adapting the Occasio theme.
- It is self-contained under `themes/wiki` and includes its own CSS, JS, fonts, and genericons.

Features
- Collapsible Table of Contents (TOC) generated from `h1`–`h4` inside `#post-wrapper`.
- Active-section highlighting as you scroll (IntersectionObserver; falls back gracefully if unavailable).
- Search widget in the sidebar (site search using `?s=term`).
- Tag cloud widget in the sidebar (uses platform `tag_cloud()` helper).
- Arabic/RTL support: `.arabic-text` helper and `:lang(ar)` rules included in `css/wiki.css`.

Files of interest
- `layout.html.php` — theme layout, includes `wiki.css` and `wiki.js` and the sidebar widgets.
- `css/wiki.css` — wiki-specific styles: TOC, tag cloud, RTL helper.
- `js/wiki.js` — TOC builder, smooth scroll, toggle and active-section highlighting.
- `post.html.php` — displays tags under posts (uses `$p->tag`).

Customization
- TOC depth: modify the selector in `js/wiki.js` (currently `h1, h2, h3, h4`) to include/exclude levels.
- Toggle default: change the aria-expanded initial state in `layout.html.php` or adjust `#wiki-toc-content` display via CSS.
- Tag styling: edit `css/wiki.css` `.tagcloud a` rules. Tag links point to `/tag/<tag>` routes handled by the platform.

Testing & local server
1) Start PHP built-in server from site root:

```powershell
Set-Location -Path 'C:\\Users\\ashra\\OneDrive\\Desktop\\jp folder - full backup'
php -S localhost:8000
```

2) Open `http://localhost:8000/`.
3) Verify:
- Sidebar shows a "Contents" widget with a toggle button.
- TOC entries scroll smoothly and highlight the active section while scrolling.
- Tags show as a cloud and clicking a tag navigates to the tag archive page `/tag/<tag>`.

Notes
- The theme relies on the platform's `tag_cloud()` and `recent_posts()` helpers where appropriate; no changes were made to platform routing.
- If you want deeper TOC features (collapsible nested sections, highlight on click), ask and I can extend `js/wiki.js`.
