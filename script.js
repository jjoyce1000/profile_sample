document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile Menu ──
    const burger = document.getElementById('burger');
    const links = document.getElementById('topbar-links');

    burger?.addEventListener('click', () => {
        burger.classList.toggle('open');
        links.classList.toggle('open');
    });

    links?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('open');
            links.classList.remove('open');
        });
    });

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector(a.getAttribute('href'));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ── Pinned Header + Active Link ──
    const topbar = document.getElementById('topbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.topbar-links a');

    function onScroll() {
        const y = window.scrollY;
        topbar.classList.toggle('pinned', y > 50);

        let current = '';
        sections.forEach(s => {
            if (y >= s.offsetTop - 140) current = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Counter Animation ──
    const counters = document.querySelectorAll('[data-count]');
    let counted = false;

    function runCounters() {
        counters.forEach(el => {
            const target = +el.dataset.count;
            const dur = 2000;
            const start = performance.now();

            (function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(target * ease);
                if (p < 1) requestAnimationFrame(tick);
            })(start);
        });
    }

    const metricObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            runCounters();
        }
    }, { threshold: 0.4 });

    document.querySelectorAll('.hero-metrics').forEach(el => metricObs.observe(el));

    // ── Scroll Reveal (staggered) ──
    const revealEls = document.querySelectorAll(
        '.tl-item, .card, .cred-card, .contact-tile, .about-headline, .about-body, .about-skills, .section-label, .timeline-heading, .work-heading, .cred-heading, .contact-heading'
    );

    revealEls.forEach(el => el.classList.add('sr'));

    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.closest('.work-grid, .cred-grid, .contact-row, .timeline-track')
                    ? [...entry.target.parentElement.children].indexOf(entry.target) * 100
                    : 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    // ── Skill Pill Shuffle on Hover ──
    const pillContainer = document.querySelector('.about-skills');
    if (pillContainer) {
        let shuffleTimeout;
        pillContainer.addEventListener('mouseenter', () => {
            clearTimeout(shuffleTimeout);
            const pills = [...pillContainer.children];
            pills.forEach((pill, i) => {
                pill.style.transition = `transform 0.5s ${i * 30}ms var(--ease-out), opacity 0.3s`;
                pill.style.transform = 'scale(1.03)';
            });
        });
        pillContainer.addEventListener('mouseleave', () => {
            [...pillContainer.children].forEach(pill => {
                pill.style.transform = '';
            });
        });
    }

    // ── Dark / Light Mode Toggle ──
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light');
    }

    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // ── Contact Button → mailto ──
    const msgBtn = document.getElementById('msg-btn');
    msgBtn?.addEventListener('click', () => {
        window.location.href = 'mailto:jjoyce1000@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20John%2C%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20connect.%0A%0A';
    });

});
