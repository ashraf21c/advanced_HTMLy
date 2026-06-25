(function(){
    // Loader for PageDown locale files and editor initialization.
    // Usage: set window.ADMIN_LANG before loading this file (optional). The loader
    // will also read navigator.language as fallback. It will then load the
    // corresponding Markdown.local.{lang}.js file (if available) and call the
    // editor init function `window.__htmly_init_markdown_editor()` when ready.

    function loadScript(url, cb) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = url;
        s.async = true;
        s.onload = function(){ cb && cb(null); };
        s.onerror = function(){ cb && cb(new Error('Failed to load ' + url)); };
        document.head.appendChild(s);
    }

    function shortLang(code) {
        if (!code) return '';
        return code.split('-')[0].toLowerCase();
    }

    // Determine desired language.
    var lang = (window.ADMIN_LANG || navigator.language || navigator.userLanguage || '').toString();
    lang = shortLang(lang);

    // Map to the available locale codes, fallback order.
    var preferred = ['ar','en','ja','fr'];
    var chosen = null;
    for (var i=0;i<preferred.length;i++) {
        var p = preferred[i];
        if (lang === p) { chosen = p; break; }
    }
    if (!chosen) {
        // If the navigator language doesn't match, try matching prefix (e.g., "en-US").
        for (var j=0;j<preferred.length;j++) {
            if (lang.indexOf(preferred[j]) === 0) { chosen = preferred[j]; break; }
        }
    }
    // Final fallback to Arabic (as requested by user).
    if (!chosen) chosen = 'ar';

    // Determine base path for editor scripts. Templates should set `window.EDITOR_BASE` to
    // an absolute base (including trailing slash), otherwise we try to guess relative path.
    var base = (window.EDITOR_BASE || 'system/admin/editor/js/');
    if (base && base.charAt(base.length-1) !== '/') base += '/';

    var localePath = base + 'local/Markdown.local.' + chosen + '.js';

    // Load the locale file first (if it exists), then call the editor init function.
    loadScript(localePath, function(err){
        if (err) {
            // Locale file failed to load; try English then French then Japanese as fallbacks.
            var fallbacks = ['en','fr','ja'];
            var idx = 0;
            (function tryNext(){
                if (idx >= fallbacks.length) {
                    // none loaded; still try to init editor (it will use defaults)
                    if (typeof window.__htmly_init_markdown_editor === 'function') window.__htmly_init_markdown_editor();
                    return;
                }
                var p = fallbacks[idx++];
                loadScript(base + 'local/Markdown.local.' + p + '.js', function(e){
                    if (!e) {
                        if (typeof window.__htmly_init_markdown_editor === 'function') window.__htmly_init_markdown_editor();
                    } else {
                        tryNext();
                    }
                });
            })();
        } else {
            if (typeof window.__htmly_init_markdown_editor === 'function') window.__htmly_init_markdown_editor();
        }
    });
})();
