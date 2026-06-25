/* global occasioScreenReaderText */
/**
 * Theme Navigation
 *
 * @package Occasio
 */
 
 
(function ($) {
    $.fn.tabbedWidget = function (widget) {
        var instance = "#" + widget.attr("id");
        $(instance + " .tzwb-tabnavi li a:first").addClass("current-tab");
        $(instance + " .tzwb-tabcontent").hide();
        $(instance + " .tzwb-tabcontent:first").show();
        $(instance + " .tzwb-tabnavi li a").click(function () {
            $(instance + " .tzwb-tabnavi li a").removeClass("current-tab");
            $(this).addClass("current-tab");
            $(instance + " .tzwb-tabcontent").hide();
            var activeTab = $(this).attr("href");
            $(activeTab).fadeIn("fast");
            return !1;
        });
    };
    function initTabbedWidget(widget) {
        widget.find(".tzwb-tabbed-content").tabbedWidget(widget);
    }
    $(document).ready(function () {
        $(".tzwb-tabbed-content").each(function () {
            initTabbedWidget($(this));
        });
    });
})(jQuery);

(function( $ ) {

	function initNavigation( containerClass, naviClass ) {
		var container  = $( containerClass );
		var navigation = $( naviClass );

		// Return early if navigation is missing.
		if ( ! navigation.length ) {
			return;
		}

		// Enable menuToggle.
		(function() {
			var menuToggle = container.find( '.menu-toggle' );

			// Return early if menuToggle is missing.
			if ( ! menuToggle.length ) {
				return;
			}

			// Add an initial value for the attribute.
			menuToggle.attr( 'aria-expanded', 'false' );

			menuToggle.on( 'click.occasio_', function() {
				navigation.toggleClass( 'toggled-on' );

				$( this ).attr( 'aria-expanded', navigation.hasClass( 'toggled-on' ) );
			});
		})();

		// Enable dropdownToggles that displays child menu items.
		(function() {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', {
			'class': 'dropdown-toggle-button',
			'aria-expanded': false
		} ).append( $( '<span />', {
			'class': 'screen-reader-text',
			text: screenReaderText.expand
		} ) );;

			navigation.find( '.item.dropdown > a' ).after( dropdownToggle );

		// Toggle buttons and submenu items with active children menu items.
		container.find( '.item.dropdown.active > button' ).addClass( 'toggled-on' );
		container.find( '.item.dropdown.active > .sub-menu' ).addClass( 'toggled-on' );

			navigation.find( '.dropdown-toggle-button' ).click( function( e ) {
				var _this = $( this ),
					screenReaderSpan = _this.find( '.screen-reader-text' );

				e.preventDefault();
				_this.toggleClass( 'toggled-on' );
				_this.next( '.children, .sub-menu, .subnav, .dropdown-menu' ).toggleClass( 'toggled-on' );

				_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );

				screenReaderSpan.text( screenReaderSpan.text() === occasioScreenReaderText.expand ? occasioScreenReaderText.collapse : occasioScreenReaderText.expand );
			} );
		})();

		// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
		(function() {
			var menuList   = navigation.children( 'ul.menu' );

			if ( ! menuList.length || ! menuList.children().length ) {
				return;
			}

			// Toggle `focus` class to allow submenu access on tablets.
			function toggleFocusClassTouchScreen() {
				if ( 'none' === $( '.menu-toggle' ).css( 'display' ) ) {

					$( document.body ).on( 'touchstart.occasio_', function( e ) {
						if ( ! $( e.target ).closest( naviClass + ' li' ).length ) {
							$( naviClass + ' li' ).removeClass( 'focus' );
						}
					});

					menuList.find( '.menu-item-has-children > a, .page_item_has_children > a' )
						.on( 'touchstart.occasio_', function( e ) {
							var el = $( this ).parent( 'li' );

							if ( ! el.hasClass( 'focus' ) ) {
								e.preventDefault();
								el.toggleClass( 'focus' );
								el.siblings( '.focus' ).removeClass( 'focus' );
							}
						});

				} else {
					menuList.find( '.menu-item-has-children > a, .page_item_has_children > a' ).unbind( 'touchstart.occasio_' );
				}
			}

			if ( 'ontouchstart' in window ) {
				$( window ).on( 'resize.occasio_', toggleFocusClassTouchScreen );
				toggleFocusClassTouchScreen();
			}

			menuList.find( 'a' ).on( 'focus.occasio_ blur.occasio_', function() {
				$( this ).parents( '.menu-item, .page_item' ).toggleClass( 'focus' );
			});
		})();
	}

	// Init Main Navigation.
	initNavigation( '.header-main', '.main-navigation' );

	// Init Top Navigation.
	initNavigation( '.header-bar', '.top-navigation' );

})( jQuery );

/* Link preview generator
	 - Detects anchors with `a.preview-link`, `a.link-preview` or `a[data-preview]`
	 - Calls `preview.php?url=` to obtain metadata (JSON)
	 - Renders `.link-preview` cards to match theme CSS
	 - Caches results in sessionStorage and degrades gracefully on errors
*/
(function($){
	'use strict';

	function safeText(s){
		if (!s) return '';
		return String(s).trim();
	}

	class LinkPreviewGenerator {
		constructor(opts){
			this.selector = (opts && opts.selector) || 'a.preview-link, a.link-preview, a[data-preview]';
			this.apiPath = (opts && opts.apiPath) || (window.base_path ? window.base_path + 'preview.php' : '/preview.php');
			this.cacheTtl = (opts && opts.cacheTtl) || 60 * 60 * 12; // 12 hours
			this.storageKeyPrefix = 'htmly_preview_';
		}

		init(){
			var self = this;
			$(document).ready(function(){
				self.attachToExisting();
				// If new links are added dynamically you can call attachToExisting again.
			});
		}

		attachToExisting(){
				var self = this;
				$(this.selector).each(function(){
					var $a = $(this);
					if ($a.data('preview-processed')) return;
					$a.data('preview-processed', true);
					// Insert placeholder element and lazy-load the preview when visible or on hover
					var $placeholder = $('<div class="link-preview loading" data-preview-placeholder>Loading preview</div>');
					$a.after($placeholder);
					// Use IntersectionObserver when available
					if ('IntersectionObserver' in window) {
						var io = new IntersectionObserver(function(entries, obs){
							entries.forEach(function(entry){
								if (entry.isIntersecting) {
									obs.unobserve(entry.target);
									self._loadForAnchor($a, $placeholder);
								}
							});
						}, { rootMargin: '200px' });
						io.observe($placeholder[0]);
					} else {
						// Fallback: load on mouseenter or focus
						$a.one('mouseenter focus', function(){ self._loadForAnchor($a, $placeholder); });
						// Also load after small delay for progressive enhancement
						setTimeout(function(){ if ($placeholder.is(':visible')) self._loadForAnchor($a, $placeholder); }, 3000);
					}
				});
			}

		processAnchor($a){
			// legacy entrypoint (immediate load) kept for compatibility
			var $ph = $a.next('[data-preview-placeholder]');
			if ($ph && $ph.length) {
				this._loadForAnchor($a, $ph);
			} else {
				this._loadForAnchor($a, null);
			}
		}

		_loadForAnchor($a, $placeholder){
			var href = $a.attr('href');
			if (!href) return;
			var self = this;
			if ($placeholder && $placeholder.data('loading')) return; // already loading
			if ($placeholder) $placeholder.data('loading', true).removeClass('loading');

			var cache = this.getCache(href);
			if (cache) {
				if ($placeholder) $placeholder.remove();
				this.renderPreview($a, cache);
				return;
			}

			var apiUrl = this.apiPath + '?url=' + encodeURIComponent(href);

			// AbortController/timeout
			var controller = (window.AbortController) ? new AbortController() : null;
			var signal = controller ? controller.signal : undefined;
			var timeout = setTimeout(function(){ if (controller) controller.abort(); }, 10000);

			fetch(apiUrl, { method: 'GET', credentials: 'same-origin', signal: signal })
				.then(function(resp){ clearTimeout(timeout); if (!resp.ok) throw new Error('Bad response'); return resp.json(); })
				.then(function(json){
					if (!json || json.error) throw new Error(json && json.error ? json.error : 'No metadata');
					self.setCache(href, json);
					if ($placeholder) $placeholder.remove();
					self.renderPreview($a, json);
				})
				.catch(function(err){
					clearTimeout(timeout);
					if ($placeholder) {
						$placeholder.remove();
					}
					var $fallback = $('<div class="link-preview fallback"></div>');
					var $link = $a.clone();
					$link.text(safeText($link.text()) || href);
					$fallback.append($link);
					$a.after($fallback);
				});
		}

		renderPreview($a, data){
			var href = $a.attr('href');
			var title = safeText(data.title) || href;
			var description = safeText(data.description) || '';
			var image = safeText(data.image) || '';
			var siteName = safeText(data.site_name) || (new URL(href)).hostname || href;

			var $card = $('<div class="link-preview"></div>');
			if (image) {
				var $img = $('<img class="preview-image" alt=""/>').attr('src', image);
				$card.append($img);
			}
			var $content = $('<div class="preview-content"></div>');
			if (siteName) {
				$content.append($('<div class="preview-site"></div>').text(siteName));
			}
			$content.append($('<div class="preview-title"></div>').text(title));
			if (description) $content.append($('<div class="preview-description"></div>').text(description));
			$content.append($('<div class="preview-url"></div>').text((new URL(href)).hostname || href));
			$card.append($content);

			// clicking the card navigates to the link
			$card.on('click', function(e){
				if (e.target.tagName.toLowerCase() === 'a') return; // let anchors work
				window.open(href, '_blank');
			});

			$a.after($card);
		}

		getCache(url){
			try {
				var key = this.storageKeyPrefix + url;
				var raw = sessionStorage.getItem(key);
				if (!raw) return null;
				var obj = JSON.parse(raw);
				if (!obj || !obj.ts) return null;
				if ((Date.now() - obj.ts) / 1000 > this.cacheTtl) { sessionStorage.removeItem(key); return null; }
				return obj.data;
			} catch (e) { return null; }
		}

		setCache(url, data){
			try {
				var key = this.storageKeyPrefix + url;
				var obj = { ts: Date.now(), data: data };
				sessionStorage.setItem(key, JSON.stringify(obj));
			} catch (e) { /* ignore storage errors */ }
		}
	}

	// Auto-init
	$(function(){
		try { new LinkPreviewGenerator({}).init(); } catch(e) { /* fail silently */ }
	});

})(jQuery);


