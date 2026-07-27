// ===== INTRO =====
const introSplash = document.getElementById('introSplash');
let introTimer = null;

function hideIntro() {
    introSplash.classList.add('hide');
}

function playIntro() {
    clearTimeout(introTimer);
    introSplash.style.transition = 'none';
    introSplash.classList.remove('hide');
    void introSplash.offsetWidth;
    introSplash.style.transition = '';
    introSplash.querySelectorAll('.intro-name img, .intro-line span, .intro-tag')
        .forEach((el) => {
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = '';
        });
    introTimer = setTimeout(hideIntro, 2600);
}

document.addEventListener('DOMContentLoaded', () => { introTimer = setTimeout(hideIntro, 2600); });
introSplash.addEventListener('click', hideIntro);
window.addEventListener('keydown', hideIntro, { once: true });

// ===== CAROUSEL =====
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');
const fixedLogo = document.getElementById('fixedLogo');
const totalSlides = slides.length;
let currentSlide = 0;
let isAnimating = false;

function updateArrows() {
    arrowLeft.disabled = currentSlide === 0;
    arrowRight.disabled = currentSlide === totalSlides - 1;
}

function reflow(el) { void el.offsetHeight; }

// Trigger staggered entrance animations on slide children
function triggerSlideAnimations(slideIndex) {
    const slide = slides[slideIndex];
    if (!slide) return;

    // Reset and replay CSS animations on page-content children
    const pageContent = slide.querySelector('.page-content');
    if (pageContent) {
        // Reset animation by removing and re-adding animated elements
        const animatedEls = pageContent.querySelectorAll(
            '.skill-category, .project-card, .experience-item, .form-field, .social-icon, .about-img, .about-right, .contact-info'
        );
        animatedEls.forEach((el) => {
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = '';
        });
    }

    // Animate experience items
    if (slide.classList.contains('experience-page')) {
        const items = slide.querySelectorAll('.experience-item');
        items.forEach((item, i) => {
            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('visible');
            }, 100 + i * 120);
        });
    }
}

function showSlide(index, direction) {
    if (index < 0 || index >= totalSlides) return;
    if (isAnimating || index === currentSlide) return;
    isAnimating = true;

    const dir = direction || (index > currentSlide ? 1 : -1);
    const oldSlide = slides[currentSlide];
    const newSlide = slides[index];

    // Outgoing slide
    oldSlide.style.transition = 'transform 0.6s cubic-bezier(.77, 0, .18, 1), opacity 0.5s ease';
    oldSlide.style.transform = `translateX(${-dir * 10}%) scale(0.96)`;
    oldSlide.style.opacity = '0';
    oldSlide.classList.remove('active');

    // Incoming slide: position off-screen, then animate in
    newSlide.style.transition = 'none';
    newSlide.style.transform = `translateX(${dir * 10}%) scale(0.96)`;
    newSlide.style.opacity = '0';
    reflow(newSlide);

    newSlide.style.transition = 'transform 0.7s cubic-bezier(.77, 0, .18, 1), opacity 0.6s ease';
    newSlide.style.transform = 'translateX(0) scale(1)';
    newSlide.style.opacity = '1';
    newSlide.classList.add('active');

    // Update indicators
    indicators.forEach((i) => i.classList.remove('active'));
    indicators[index].classList.add('active');
    fixedLogo.classList.toggle('visible', index !== 0);

    currentSlide = index;
    updateArrows();

    // Trigger entrance animations for the new slide
    triggerSlideAnimations(index);

    setTimeout(() => { isAnimating = false; }, 750);
}

function nextSlide() { showSlide(currentSlide + 1, 1); }
function previousSlide() { showSlide(currentSlide - 1, -1); }
function goToSlide(n) { showSlide(n); }

arrowLeft.addEventListener('click', previousSlide);
arrowRight.addEventListener('click', nextSlide);

indicators.forEach((dot) => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index, 10)));
});

document.querySelectorAll('[data-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
});

// Click logo: return to hero + replay intro
fixedLogo.addEventListener('click', (e) => {
    e.preventDefault();
    showSlide(0, -1);
    playIntro();
});

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextSlide();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') previousSlide();
});

// ===== PARALLAX HERO WORDMARK =====
const heroWordmark = document.querySelector('.hero-wordmark');
const heroSection = document.querySelector('.hero-page');

if (heroWordmark && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroWordmark.style.transform = `translateY(-50%) translate(${x * 20}px, ${y * 15}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        heroWordmark.style.transition = 'transform 0.6s ease-out';
        heroWordmark.style.transform = 'translateY(-50%) translate(0, 0)';
        setTimeout(() => { heroWordmark.style.transition = ''; }, 600);
    });
}

// ===== TILT EFFECT ON CARDS =====
function addTiltEffect(selector, maxTilt = 6) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (0.5 - y) * maxTilt;
            const tiltY = (x - 0.5) * maxTilt;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });
}

// Apply tilt to skill cards and project cards
addTiltEffect('.skill-category', 5);
addTiltEffect('.project-card', 4);

// ===== AMBIENT GLOW FOLLOWS MOUSE (Hero) =====
const ambientGlow = document.querySelector('.ambient-glow');
const heroImage = document.querySelector('.hero-image');

if (ambientGlow && heroImage) {
    heroImage.addEventListener('mousemove', (e) => {
        const rect = heroImage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        ambientGlow.style.left = x + '%';
        ambientGlow.style.top = y + '%';
    });

    heroImage.addEventListener('mouseleave', () => {
        ambientGlow.style.transition = 'left 0.8s ease, top 0.8s ease';
        ambientGlow.style.left = '50%';
        ambientGlow.style.top = '38%';
        setTimeout(() => { ambientGlow.style.transition = ''; }, 800);
    });
}

// ===== MAGNETIC BUTTON EFFECT =====
function addMagneticEffect(selector, strength = 0.3) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * strength}px, ${y * strength - 3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            el.style.transform = 'translate(0, 0)';
            setTimeout(() => { el.style.transition = ''; }, 400);
        });
    });
}

addMagneticEffect('.hero-btn');
addMagneticEffect('.social-icon', 0.2);

// ===== FORMULAIRE DE CONTACT =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameField = document.getElementById('cf-name');
        const emailField = document.getElementById('cf-email');
        const messageField = document.getElementById('cf-message');
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());

        let valid = true;
        [
            [nameField, nameField.value.trim().length > 0],
            [emailField, isEmailValid],
            [messageField, messageField.value.trim().length > 0]
        ].forEach(([field, ok]) => {
            field.closest('.form-field').classList.toggle('invalid', !ok);
            if (!ok) valid = false;
        });
        if (!valid) return;

        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Message envoyé !';
        button.style.backgroundColor = '#2e8b57';
        button.style.borderColor = '#2e8b57';
        button.style.transform = 'scale(1.02)';

        this.reset();

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
            button.style.transform = '';
        }, 3000);
    });
}

// ===== INITIAL STATE =====
updateArrows();

// Trigger animations for the first slide (hero) on load
setTimeout(() => {
    triggerSlideAnimations(0);
}, 300);
