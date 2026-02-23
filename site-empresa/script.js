class GHApp {
    constructor() {
        this.config = {
            headerScrollOffset: 60,
            revealThreshold: 0.15,
            backToTopOffset: 400
        };

        this.dom = {
            header: document.querySelector("header"),
            cards: document.querySelectorAll(".card"),
            navLinks: document.querySelectorAll('nav a[href^="#"]'),
            btnTop: null
        };

        this.lastScrollY = 0;
        this.ticking = false;

        this.init();
    }

    init() {
        this.initSmoothScroll();
        this.initRevealAnimation();
        this.createBackToTop();
        this.initScrollHandler();
    }

    initSmoothScroll() {
        this.dom.navLinks.forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute("href"));
                if (!target) return;

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
    }

    initRevealAnimation() {
        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                obs.unobserve(entry.target);
            });
        }, { threshold: this.config.revealThreshold });

        this.dom.cards.forEach(card => {
            card.classList.add("hidden");
            observer.observe(card);
        });
    }

    createBackToTop() {
        const button = document.createElement("button");
        button.id = "btnTop";
        button.innerHTML = "↑";
        document.body.appendChild(button);

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        this.dom.btnTop = button;
    }

    initScrollHandler() {
        window.addEventListener("scroll", () => {
            this.lastScrollY = window.scrollY;

            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    handleScroll() {
        this.updateHeader();
        this.toggleBackToTop();
    }

    updateHeader() {
        if (!this.dom.header) return;

        const scrolled = this.lastScrollY > this.config.headerScrollOffset;

        this.dom.header.style.background = scrolled
            ? "rgba(0,0,0,0.97)"
            : "rgba(0,0,0,0.9)";

        this.dom.header.style.boxShadow = scrolled
            ? "0 8px 25px rgba(10,132,255,0.35)"
            : "none";
    }

    toggleBackToTop() {
        if (!this.dom.btnTop) return;

        this.dom.btnTop.classList.toggle(
            "showBtn",
            this.lastScrollY > this.config.backToTopOffset
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GHApp();
});
