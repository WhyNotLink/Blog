(function() {
    function runTocTracker() {
        const tocContainer = document.querySelector('#markdown-toc');
        if (!tocContainer) return;

        const tocLinks = Array.from(tocContainer.querySelectorAll('a'));
        
        const sections = tocLinks.map(link => {
            const rawHref = link.getAttribute('href');
            const decodedId = decodeURIComponent(rawHref).replace('#', '');
            let el = document.getElementById(decodedId); 
            if (!el) {
                const allHeaders = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                const searchText = decodedId.split(/[-.]/).pop(); 
                el = Array.from(allHeaders).find(h => {
                    const hId = h.getAttribute('id') || "";
                    return hId.includes(searchText);
                });
            }
            return el;
        });

        function updateActive(manualIndex = -1) {
            let activeIndex = manualIndex;

            if (activeIndex === -1) {
                const threshold = 240; 
                
                for (let i = sections.length - 1; i >= 0; i--) {
                    if (!sections[i]) continue;
                    const rect = sections[i].getBoundingClientRect();
                    if (rect.top <= threshold) {
                        activeIndex = i;
                        break;
                    }
                }
            }

            tocLinks.forEach((link, index) => {
                if (index === activeIndex) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }


        tocLinks.forEach((link, index) => {
            link.addEventListener('click', () => {
                setTimeout(() => updateActive(index), 50);
            });
        });

        window.addEventListener('scroll', () => {
            updateActive();
        }, { passive: true });

        updateActive();
    }

    window.addEventListener('load', runTocTracker);
})();
