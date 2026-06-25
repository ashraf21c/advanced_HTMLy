# Wiki theme (adapted from Occasio)

Overview
- This is a documentation/wiki-focused theme created by adapting the Occasio theme.
- It is self-contained under `themes/wiki` and includes its own CSS, JS, fonts, and genericons.

Features
- Collapsible Table of Contents (TOC) generated from `h1`–`h4` inside `#post-wrapper`.
- Active-section highlighting as you scroll (IntersectionObserver; falls back gracefully if unavailable).
- Keyboard navigation: arrow keys move between TOC items; Enter expands/collapses nested sections.
- Sticky current-section indicator in the main content area.
- Search widget in the sidebar (site search using `?s=term`).
- Tag cloud widget in the sidebar (uses platform `tag_cloud()` helper).
- Arabic/RTL support: `.arabic-text` helper and `:lang(ar)` rules included in `css/wiki.css`.

Files of interest
- `layout.html.php` — theme layout, includes `wiki.css` and `wiki.js` and the sidebar widgets.
- `css/wiki.css` — wiki-specific styles: TOC, tag cloud, RTL helper, sticky section.
- `js/wiki.js` — TOC builder, smooth scroll, toggle, active-section highlighting, keyboard nav.
- `post.html.php` — displays tags under posts (uses `$p->tag`).
- `main--tag.html.php` — tag archive listing template.

Customization
- TOC depth: modify the selector in `js/wiki.js` (currently `h1, h2, h3, h4`) to include/exclude levels.
- Toggle default: change aria-expanded initial state in `layout.html.php` or adjust `#wiki-toc-content` display via CSS.
- Collapse depth: change the depth threshold in `js/wiki.js` (currently >= 3 collapses by default).
- Tag styling: edit `css/wiki.css` `.tagcloud a` rules. Tag links point to `/tag/<tag>` routes handled by the platform.
- Sticky section height: adjust `.wiki-current-section { top: ... }` in `css/wiki.css` (default 88px).

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
- Use arrow keys to navigate between TOC items; press Enter to toggle nested sections.
- A sticky badge shows the current section being read in the main content area.
- Tags show as a cloud and clicking a tag navigates to the tag archive page `/tag/<tag>`.

Keyboard Shortcuts
- Arrow Up/Down: navigate between TOC links.
- Enter: expand/collapse nested sections (if the focused link has children).
- Click/Tap: smooth scroll to heading and update URL hash.

Notes
- The theme relies on the platform's `tag_cloud()` and helper functions; no changes were made to platform routing.
- If you want deeper TOC features (auto-collapse siblings, highlight on click), ask and I can extend `js/wiki.js`.
