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
    void introSplash.offsetWidth; // force le reflow avant de réactiver la transition
    introSplash.style.transition = '';
    introSplash.querySelectorAll('.intro-logo, .intro-name span, .intro-line span, .intro-tag')
        .forEach((el) => {
            el.style.animation = 'none';
            void el.offsetWidth; // force le redémarrage de l'animation
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

function showSlide(index, direction) {
    if (index < 0 || index >= totalSlides) return;
    if (isAnimating || index === currentSlide) return;
    isAnimating = true;

    const dir = direction || (index > currentSlide ? 1 : -1);
    const oldSlide = slides[currentSlide];
    const newSlide = slides[index];

    oldSlide.style.transform = `translateX(${-dir * 8}%)`;
    oldSlide.style.opacity = '0';
    oldSlide.classList.remove('active');

    newSlide.style.transition = 'none';
    newSlide.style.transform = `translateX(${dir * 8}%)`;
    newSlide.style.opacity = '0';
    reflow(newSlide);

    newSlide.style.transition = '';
    newSlide.style.transform = 'translateX(0)';
    newSlide.style.opacity = '1';
    newSlide.classList.add('active');

    indicators.forEach((i) => i.classList.remove('active'));
    indicators[index].classList.add('active');
    fixedLogo.classList.toggle('visible', index !== 0);

    currentSlide = index;
    updateArrows();
    setTimeout(() => { isAnimating = false; }, 720);
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

// Clic sur le logo : retour à l'accueil + rejoue l'animation d'intro
fixedLogo.addEventListener('click', (e) => {
    e.preventDefault();
    showSlide(0, -1);
    playIntro();
});

// Navigation clavier (flèches uniquement)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextSlide();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') previousSlide();
});

// La molette et le glissement tactile ne changent plus de section : ils ne
// servent qu'à faire défiler le contenu interne (ex: liste Expérience) quand
// il dépasse la hauteur de l'écran. Seuls les flèches, le clavier et les
// points de navigation changent de page.

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

        this.reset();

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        }, 3000);
    });
}

updateArrows();