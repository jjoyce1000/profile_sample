document.addEventListener('DOMContentLoaded', () => {

    // ── Nav: scroll state + active links ──
    const nav      = document.getElementById('nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 40);

        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Smooth scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ── Mobile burger ──
    const burger    = document.getElementById('burger');
    const navLinksEl = document.getElementById('nav-links');

    burger?.addEventListener('click', () => {
        burger.classList.toggle('open');
        navLinksEl.classList.toggle('open');
    });
    navLinksEl?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('open');
            navLinksEl.classList.remove('open');
        });
    });

    // ── Dark / Light theme ──
    const themeBtn = document.getElementById('theme-btn');
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

    themeBtn?.addEventListener('click', () => {
        document.body.classList.toggle('light');
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });

    // ── Stat counter animation ──
    const counters   = document.querySelectorAll('[data-count]');
    let   counted    = false;

    function runCounters() {
        counters.forEach(el => {
            const target = +el.dataset.count;
            const dur    = 2200;
            const start  = performance.now();
            const suffix = target >= 1000 ? '+' : (el.dataset.suffix || '+');

            (function tick(now) {
                const p    = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 4);
                const val  = Math.round(target * ease);
                el.textContent = val >= 1000 ? val.toLocaleString() + suffix : val + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(start);
        });
    }

    const statsObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            runCounters();
        }
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) statsObs.observe(statsEl);

    // ── Scroll reveal ──
    const revealEls = document.querySelectorAll(
        '.tl-item, .proj-card, .edu-card, .tile, ' +
        '.about-left, .about-right, ' +
        '.section-label, .section-heading, .hero-eyebrow, .hero-heading, .hero-bio, .hero-actions, .hero-stats, .photo-wrap, .ticker-wrap'
    );

    revealEls.forEach(el => el.classList.add('sr'));

    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const parent  = entry.target.closest('.projects-grid, .edu-grid, .contact-tiles, .timeline');
            const delay   = parent
                ? [...entry.target.parentElement.children].indexOf(entry.target) * 80
                : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    // ── Contact "Send a Message" → mailto ──
    document.getElementById('msg-btn')?.addEventListener('click', () => {
        window.location.href = 'mailto:jjoyce1000@gmail.com'
            + '?subject=Portfolio%20Inquiry'
            + '&body=Hi%20John%2C%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20connect.';
    });

    // ── Skills hover ripple ──
    document.querySelectorAll('.skills-grid span').forEach((span, i) => {
        span.style.transitionDelay = `${i * 12}ms`;
    });

    // ── Seamless ticker ──
    function initTicker() {
        const track = document.querySelector('.ticker-track');
        if (!track) return;

        // Clone original items once so we have exactly two identical sets
        const origItems = [...track.children];
        origItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // After paint, measure the exact pixel width of the first (original) set
        requestAnimationFrame(() => {
            const originalWidth = origItems.reduce((sum, el) => sum + el.offsetWidth, 0);
            // Translate by exactly the original set width — no rounding issues
            track.style.setProperty('--ticker-shift', `-${originalWidth}px`);
            // Speed: ~65 px/s feels smooth
            const dur = originalWidth / 65;
            track.style.setProperty('--ticker-dur', `${dur.toFixed(2)}s`);
        });
    }

    initTicker();

});
