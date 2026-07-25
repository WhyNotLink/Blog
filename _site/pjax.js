/**
 * PJAX - 无刷新页面跳转（淡出 → 替换 → 淡入）
 */
(function() {
    'use strict';

    if (!window.history || !window.history.pushState || !window.fetch) return;

    function init() {
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a');
            if (!link) return;
            if (shouldHandle(link)) {
                e.preventDefault();
                navigate(link.href);
            }
        });
        window.addEventListener('popstate', function(e) {
            if (e.state && e.state.pjax) {
                navigate(window.location.href, true);
            }
        });
    }

    function shouldHandle(link) {
        if (link.hostname !== window.location.hostname) return false;
        if (link.target || link.hasAttribute('download')) return false;
        if (link.href.indexOf('#') !== -1 && link.pathname === window.location.pathname) return false;
        if (link.href.indexOf('mailto:') !== -1 || link.href.indexOf('tel:') !== -1) return false;
        return true;
    }

    function navigate(url, isPopState) {
        var main = document.getElementById('main-content');

        // 1. 立即隐藏当前内容（无过渡）
        main.style.transition = 'none';
        main.style.opacity = '0';
        main.style.transform = 'translateY(30px)';

        fetch(url)
        .then(function(r) { return r.text(); })
        .then(function(html) {
            var parser = new DOMParser();
            var newDoc = parser.parseFromString(html, 'text/html');

            // 如果新页面没有 #main-content，说明是独立页面，淡出后跳转
            if (!newDoc.getElementById('main-content')) {
                // 恢复内容可见，再加淡出动画
                main.style.transition = '';
                main.style.opacity = '';
                main.style.transform = '';
                document.body.classList.add('page-exit');
                setTimeout(function() {
                    window.location.href = url;
                }, 300);
                return;
            }

            // 2. 预加载新 CSS + 需要的脚本
            var newMain = newDoc.getElementById('main-content');
            var cssReady = loadNewCSS(newDoc, url);
            var minDelay = new Promise(function(resolve) { setTimeout(resolve, 400); });

            // 预加载 mermaid（如果新页面有 mermaid 块）
            var mermaidReady = Promise.resolve();
            if (newMain && newMain.innerHTML.indexOf('class="mermaid"') !== -1 || newMain.innerHTML.indexOf('language-mermaid') !== -1) {
                if (typeof window.mermaid === 'undefined') {
                    mermaidReady = new Promise(function(resolve) {
                        loadScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js', resolve);
                    });
                }
            }
            // 预加载 highlight.js（如果新页面有代码块）
            var hljsReady = Promise.resolve();
            if (newMain && (newMain.innerHTML.indexOf('<pre><code') !== -1 || newMain.innerHTML.indexOf('class="language-') !== -1)) {
                if (typeof window.hljs === 'undefined') {
                    hljsReady = new Promise(function(resolve) {
                        loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js', resolve);
                    });
                }
            }

            Promise.all([cssReady, mermaidReady, hljsReady, minDelay]).then(function() {
                // 3. 替换内容（用户看不到，因为 opacity: 0）
                updatePage(newDoc, url);
                removeOldCSS(newDoc);

                // 执行页面特有的初始化脚本
                if (typeof window.pjaxLoaded === 'function') window.pjaxLoaded();
                if (typeof window.initThemeToggle === 'function') window.initThemeToggle();
                if (window.hljs) window.hljs.highlightAll();
                if (typeof window.mermaid !== 'undefined') {
                    try { window.mermaid.run(); } catch(e) {}
                }

                if (!isPopState) {
                    window.history.pushState({ pjax: true }, '', url);
                }
                window.scrollTo(0, 0);

                // 4. 让浏览器完成渲染，然后淡入
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        // 恢复 transition + 移除 inline 样式 → 淡入 + 向上滑入
                        main.style.transition = '';
                        main.style.opacity = '';
                        main.style.transform = '';
                    });
                });
            });
        })
        .catch(function() {
            window.location.href = url;
        });
    }

    function updatePage(newDoc, url) {
        document.title = newDoc.title;

        // body class - 同步（分类页面有 fade-in-content 等特殊 class）
        document.body.className = newDoc.body.className;

        // navbar - 始终同步，文章页导航栏样式可能不同
        var oldNav = document.getElementById('navbar');
        var newNav = newDoc.getElementById('navbar');
        if (oldNav && newNav) {
            oldNav.outerHTML = newNav.outerHTML;
        }

        // hero
        var oldHero = document.querySelector('.hero');
        var newHero = newDoc.querySelector('.hero');
        if (oldHero && !newHero) oldHero.remove();
        else if (!oldHero && newHero) {
            var nav = document.getElementById('navbar');
            if (nav) nav.insertAdjacentHTML('afterend', newHero.outerHTML);
        } else if (oldHero && newHero) {
            oldHero.innerHTML = newHero.innerHTML;
            oldHero.className = newHero.className;
        }

        // main
        var oldMain = document.getElementById('main-content');
        var newMain = newDoc.getElementById('main-content');
        if (oldMain && newMain) {
            oldMain.className = newMain.className;
            oldMain.innerHTML = newMain.innerHTML;

            var scripts = oldMain.querySelectorAll('script');
            for (var i = 0; i < scripts.length; i++) {
                var s = scripts[i];
                var ns = document.createElement('script');
                for (var j = 0; j < s.attributes.length; j++) {
                    ns.setAttribute(s.attributes[j].name, s.attributes[j].value);
                }
                ns.textContent = s.textContent;
                s.parentNode.replaceChild(ns, s);
            }
        }
    }

    // 加载新 CSS（不删除旧的）
    function loadNewCSS(newDoc, pageUrl) {
        var existing = [];
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for (var i = 0; i < links.length; i++) {
            existing.push(links[i].getAttribute('href'));
        }

        var promises = [];
        var newLinks = newDoc.querySelectorAll('link[rel="stylesheet"]');
        for (var j = 0; j < newLinks.length; j++) {
            var rawHref = newLinks[j].getAttribute('href');
            // 将相对路径解析为绝对路径（基于目标页面 URL）
            var href = resolveURL(rawHref, pageUrl);
            // 检查是否已存在（用文件名匹配，避免路径差异导致重复加载）
            var alreadyLoaded = false;
            for (var k = 0; k < existing.length; k++) {
                var existingName = existing[k].split('/').pop();
                var newName = href.split('/').pop();
                if (existingName === newName) { alreadyLoaded = true; break; }
            }
            if (!alreadyLoaded) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                promises.push(new Promise(function(resolve) {
                    link.onload = resolve;
                    link.onerror = resolve;
                }));
                document.head.appendChild(link);
            }
        }
        return Promise.all(promises);
    }

    // 将相对路径解析为绝对路径
    function resolveURL(href, baseURL) {
        if (!href || href.indexOf('http') === 0 || href.indexOf('//') === 0) return href;
        if (href.charAt(0) === '/') {
            // 绝对路径（相对于域名根目录）
            return href;
        }
        // 相对路径，基于目标页面 URL 解析
        var a = document.createElement('a');
        a.href = baseURL;
        var basePath = a.pathname.substring(0, a.pathname.lastIndexOf('/') + 1);
        a.href = basePath + href;
        return a.getAttribute('href');
    }

    // 移除旧 CSS（新 CSS 已加载后调用）
    function removeOldCSS(newDoc) {
        var commonStyles = ['style.css', 'odometr.css'];
        var newHrefs = [];
        var newLinks = newDoc.querySelectorAll('link[rel="stylesheet"]');
        for (var i = 0; i < newLinks.length; i++) {
            newHrefs.push(newLinks[i].getAttribute('href'));
        }

        var existing = document.querySelectorAll('link[rel="stylesheet"]');
        // 倒序遍历，避免删除时跳过元素
        for (var j = existing.length - 1; j >= 0; j--) {
            var href = existing[j].getAttribute('href');
            var keep = false;
            for (var k = 0; k < commonStyles.length; k++) {
                if (href && href.indexOf(commonStyles[k]) !== -1) { keep = true; break; }
            }
            // 检查是否在新页面的 CSS 列表中（需要同时比较原始值和相对路径）
            if (!keep) {
                var found = false;
                for (var m = 0; m < newHrefs.length; m++) {
                    if (href === newHrefs[m]) {
                        found = true; break;
                    }
                    // 如果旧 href 的末尾和新 href 的末尾相同（处理相对路径）
                    if (href && newHrefs[m] && (href.endsWith(newHrefs[m]) || newHrefs[m].endsWith(href.replace(/.*\//, '/')))) {
                        found = true; break;
                    }
                }
                if (!found) {
                    existing[j].remove();
                }
            }
        }
    }

    // 动态加载脚本（如果尚未加载）
    function loadScript(src, callback) {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].getAttribute('src') && scripts[i].getAttribute('src').indexOf(src) !== -1) {
                // 已加载，直接回调
                if (callback) callback();
                return;
            }
        }
        var s = document.createElement('script');
        s.src = src;
        s.onload = callback || function() {};
        s.onerror = callback || function() {};
        document.head.appendChild(s);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
