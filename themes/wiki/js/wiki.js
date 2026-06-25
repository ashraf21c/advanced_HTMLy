 (function(){
    'use strict';

    function slugify(text){
        return text.toString().toLowerCase().trim()
            .replace(/[^a-z0-9\\u0600-\\u06FF\\s-]/g, '')
            .replace(/\\s+/g, '-')
            .replace(/-+/g, '-');
    }

    function clearActive(toc){
        var prev = toc.querySelectorAll('.toc-active');
        Array.prototype.forEach.call(prev, function(n){ n.classList.remove('toc-active'); });
    }

    function buildTOC(containerSelector, tocContainer){
        var container = document.querySelector(containerSelector);
        var toc = document.querySelector(tocContainer);
        if (!container || !toc) return;

        var headings = container.querySelectorAll('h1, h2, h3, h4');
        if (!headings.length) return;

        var ul = document.createElement('ul');
        var lastLevel = 1;
        var parents = [ul];

        Array.prototype.forEach.call(headings, function(h){
            var level = parseInt(h.tagName.substring(1), 10);
            var text = h.textContent || h.innerText;
            var id = h.id || slugify(text);
            h.id = id;

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            a.innerText = text;
            li.appendChild(a);

            if (level > lastLevel){
                var newUl = document.createElement('ul');
                if (parents[0].lastElementChild) parents[0].lastElementChild.appendChild(newUl);
                parents.unshift(newUl);
            } else if (level < lastLevel){
                var diff = lastLevel - level;
                for (var i=0;i<diff;i++) parents.shift();
            }
            parents[0].appendChild(li);
            lastLevel = level;
        });

        toc.appendChild(ul);

        // Add collapse toggles for nested lists (class-based collapse)
        Array.prototype.forEach.call(toc.querySelectorAll('li'), function(li){
            var childUl = li.querySelector('ul');
            if (childUl){
                li.classList.add('toc-has-children');
                var toggle = document.createElement('button');
                toggle.className = 'toc-node-toggle';
                toggle.setAttribute('aria-label', 'Toggle section');
                toggle.textContent = '▾';
                // Insert toggle before the link
                var a = li.querySelector('a');
                if (a) li.insertBefore(toggle, a);

                // Determine nesting depth (count parent ULs)
                var depth = 0; var p = li; while(p && p !== toc){ if (p.tagName && p.tagName.toLowerCase() === 'ul') depth++; p = p.parentElement; }
                // collapse deeper levels by default (depth >= 3)
                if (depth >= 3){ childUl.classList.add('toc-collapsed'); toggle.textContent = '▸'; toggle.setAttribute('aria-expanded', 'false'); } else { toggle.setAttribute('aria-expanded', 'true'); }

                toggle.addEventListener('click', function(e){
                    e.preventDefault();
                    var expanded = this.getAttribute('aria-expanded') === 'true';
                    if (expanded){ childUl.classList.add('toc-collapsed'); this.setAttribute('aria-expanded', 'false'); this.textContent = '▸'; }
                    else { childUl.classList.remove('toc-collapsed'); this.setAttribute('aria-expanded', 'true'); this.textContent = '▾'; }
                });
            }
        });

        // Helper: expand parent uls of a given link
        function expandParentsOf(link){
            var el = link.parentElement;
            while(el && el !== toc){
                if (el.tagName && el.tagName.toLowerCase() === 'ul'){
                    el.classList.remove('toc-collapsed');
                    var parentLi = el.parentElement;
                    if (parentLi){
                        var t = parentLi.querySelector('.toc-node-toggle');
                        if (t) { t.setAttribute('aria-expanded','true'); t.textContent = '▾'; }
                    }
                }
                el = el.parentElement;
            }
        }

        // smooth scrolling for links, update URL hash, and expand parents
        toc.addEventListener('click', function(e){
            if (e.target.tagName.toLowerCase() === 'a'){
                e.preventDefault();
                var id = e.target.getAttribute('href').substring(1);
                var target = document.getElementById(id);
                if (target){
                    target.scrollIntoView({behavior: 'smooth'});
                    try { history.replaceState(null, null, '#'+id); } catch (err) { location.hash = id; }
                }
                expandParentsOf(e.target);
            }
        });

        // Observe headings to highlight active TOC link
        if ('IntersectionObserver' in window){
            var observerOptions = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 };
            var io = new IntersectionObserver(function(entries){
                entries.forEach(function(entry){
                    if (entry.isIntersecting){
                        var id = entry.target.id;
                        var link = toc.querySelector('a[href="#' + id + '"]');
                        if (link){
                            clearActive(toc);
                            link.classList.add('toc-active');
                            expandParentsOf(link);
                        }
                    }
                });
            }, observerOptions);
            Array.prototype.forEach.call(headings, function(h){ io.observe(h); });
        }
    }

    function setupToggle(){
        var toggle = document.getElementById('wiki-toc-toggle');
        var toc = document.getElementById('wiki-toc-content');
        if (!toggle || !toc) return;
        toggle.addEventListener('click', function(){
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', (!expanded).toString());
            if (expanded){
                toc.style.display = 'none';
                this.textContent = '▸';
            } else {
                toc.style.display = '';
                this.textContent = '▾';
            }
        });
    }

    function setupKeyboardNav(){
        var toc = document.getElementById('wiki-toc-content');
        if (!toc) return;
        var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
        if (!links.length) return;
        var focusIndex = -1;
        document.addEventListener('keydown', function(e){
            if (e.key === 'ArrowDown'){
                e.preventDefault();
                focusIndex = (focusIndex + 1) % links.length;
                links[focusIndex].focus();
            } else if (e.key === 'ArrowUp'){
                e.preventDefault();
                focusIndex = (focusIndex - 1 + links.length) % links.length;
                links[focusIndex].focus();
            } else if (e.key === 'Enter' && document.activeElement && document.activeElement.parentElement){
                var li = document.activeElement.closest('li');
                if (li && li.classList.contains('toc-has-children')){
                    var btn = li.querySelector('.toc-node-toggle');
                    if (btn){
                        e.preventDefault();
                        btn.click();
                    }
                }
            }
        });
    }

    function setupStickySection(){
        var postWrapper = document.getElementById('post-wrapper');
        if (!postWrapper) return;
        var headings = postWrapper.querySelectorAll('h1, h2, h3, h4');
        if (!headings.length) return;
        var stickyEl = document.createElement('div');
        stickyEl.id = 'wiki-current-section';
        stickyEl.className = 'wiki-current-section';
        postWrapper.insertBefore(stickyEl, postWrapper.firstChild);
        if ('IntersectionObserver' in window){
            var visibleHeading = null;
            var io = new IntersectionObserver(function(entries){
                entries.forEach(function(entry){
                    if (entry.isIntersecting){ visibleHeading = entry.target; }
                });
                if (visibleHeading){
                    stickyEl.textContent = '📋 ' + (visibleHeading.textContent || visibleHeading.innerText);
                    stickyEl.style.opacity = '1';
                } else {
                    stickyEl.style.opacity = '0.6';
                }
            }, { root: null, rootMargin: '0px 0px -80% 0px', threshold: 0 });
            Array.prototype.forEach.call(headings, function(h){ io.observe(h); });
        }
    }

    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){ buildTOC('#post-wrapper', '#wiki-toc-content'); setupToggle(); setupKeyboardNav(); setupStickySection(); });
    } else {
        buildTOC('#post-wrapper', '#wiki-toc-content'); setupToggle(); setupKeyboardNav(); setupStickySection();
    }
})();
