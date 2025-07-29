/**
 * Talento Transpersonal - JavaScript Functionality
 * Handles sliders, form validation, navigation, and interactive features
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSliders();
    initContactForm();
    initScrollEffects();
    initAccessibility();
});

/**
 * Navigation Functionality
 */
function initNavigation() {
    const navbar = document.querySelector('nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('block');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
            }
            
            // Update aria-expanded for accessibility
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            
            // Toggle hamburger icon
            const icon = mobileMenuBtn.querySelector('svg');
            if (isOpen) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });
        
        // Close mobile menu when clicking on nav links
        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                
                // Reset hamburger icon
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('block');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    
                    // Reset hamburger icon
                    const icon = mobileMenuBtn.querySelector('svg');
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.remove('open');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
                
                // Update active link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLinkOnScroll);
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(sectionId);
        }
    });
}

/**
 * Slider Functionality
 */
function initSliders() {
    // Initialize course slider
    const courseSlider = new Slider('cursos-slider', {
        autoplay: true,
        autoplayDelay: 5000,
        showDots: true,
        showNavigation: true
    });
    
    // Initialize diploma slider if it exists
    const diplomaSlider = document.getElementById('diplomados-slider');
    if (diplomaSlider) {
        new Slider('diplomados-slider', {
            autoplay: true,
            autoplayDelay: 6000,
            showDots: true,
            showNavigation: true
        });
    }
}

/**
 * Slider Class
 */
class Slider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.options = {
            autoplay: options.autoplay || false,
            autoplayDelay: options.autoplayDelay || 3000,
            showDots: options.showDots || false,
            showNavigation: options.showNavigation || false,
            ...options
        };
        
        this.currentSlide = 0;
        this.slides = [];
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        this.createSliderStructure();
        this.setupEventListeners();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }
    
    createSliderStructure() {
        const cards = this.container.querySelectorAll('.curso-card, .diplomado-card');
        this.slides = Array.from(cards);
        
        if (this.slides.length === 0) return;
        
        // Create slider wrapper
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-container relative overflow-hidden';
        
        // Create slider track
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track flex transition-transform duration-500 ease-in-out';
        
        // Move cards to slider track
        this.slides.forEach((slide, index) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'slider-slide px-4';
            slideWrapper.appendChild(slide.cloneNode(true));
            sliderTrack.appendChild(slideWrapper);
        });
        
        sliderWrapper.appendChild(sliderTrack);
        
        // Replace original content
        const originalGrid = this.container.querySelector('.grid');
        if (originalGrid) {
            originalGrid.replaceWith(sliderWrapper);
        }
        
        this.track = sliderTrack;
        this.slideElements = sliderTrack.querySelectorAll('.slider-slide');
        
        // Create navigation
        if (this.options.showNavigation) {
            this.createNavigation();
        }
        
        // Create dots
        if (this.options.showDots) {
            this.createDots();
        }
        
        this.updateSlider();
    }
    
    createNavigation() {
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-nav prev';
        prevBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';
        prevBtn.setAttribute('aria-label', 'Slide anterior');
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-nav next';
        nextBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
        nextBtn.setAttribute('aria-label', 'Siguiente slide');
        
        this.container.querySelector('.slider-container').appendChild(prevBtn);
        this.container.querySelector('.slider-container').appendChild(nextBtn);
        
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
    }
    
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        const visibleSlides = this.getVisibleSlidesCount();
        const totalDots = Math.ceil(this.slides.length / visibleSlides);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i * visibleSlides));
            dotsContainer.appendChild(dot);
        }
        
        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    getVisibleSlidesCount() {
        const containerWidth = this.container.offsetWidth;
        if (containerWidth >= 1024) return 3;
        if (containerWidth >= 768) return 2;
        return 1;
    }
    
    updateSlider() {
        const visibleSlides = this.getVisibleSlidesCount();
        const slideWidth = 100 / visibleSlides;
        const translateX = -(this.currentSlide * slideWidth);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                const slideIndex = index * visibleSlides;
                dot.classList.toggle('active', 
                    slideIndex <= this.currentSlide && 
                    this.currentSlide < slideIndex + visibleSlides
                );
            });
        }
    }
    
    nextSlide() {
        const visibleSlides = this.getVisibleSlidesCount();
        const maxSlide = this.slides.length - visibleSlides;
        
        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
        } else {
            this.currentSlide = 0;
        }
        
        this.updateSlider();
    }
    
    prevSlide() {
        const visibleSlides = this.getVisibleSlidesCount();
        const maxSlide = this.slides.length - visibleSlides;
        
        if (this.currentSlide > 0) {
            this.currentSlide--;
        } else {
            this.currentSlide = maxSlide;
        }
        
        this.updateSlider();
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlider();
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplayDelay);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (this.options.autoplay && !this.autoplayInterval) {
            this.startAutoplay();
        }
    }
}

/**
 * Contact Form Functionality
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('mensaje');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('form-success');
    
    // Real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput));
    emailInput.addEventListener('blur', () => validateField(emailInput));
    messageInput.addEventListener('blur', () => validateField(messageInput));
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);
        
        if (isNameValid && isEmailValid && isMessageValid) {
            submitForm(form, submitBtn, successMessage);
        }
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('border-red-500');
    errorElement.classList.add('hidden');
    
    // Validate based on field type
    switch (field.type) {
        case 'text':
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Por favor ingresa un nombre válido (mínimo 2 caracteres)';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
            break;
            
        default:
            if (field.hasAttribute('required') && field.value.trim().length === 0) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            } else if (field.value.trim().length > 0 && field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Por favor escribe un mensaje más detallado (mínimo 10 caracteres)';
            }
    }
    
    // Show error if validation failed
    if (!isValid) {
        field.classList.add('border-red-500');
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden');
    }
    
    return isValid;
}

/**
 * Submit form with loading state
 */
function submitForm(form, submitBtn, successMessage) {
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        submitBtn.disabled = false;
        submitText.classList.remove('hidden');
        loadingText.classList.add('hidden');
        
        // Show success message
        successMessage.classList.remove('hidden');
        
        // Reset form
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 2000); // Simulate 2 second delay
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    // Create and add scroll to top button
    createScrollToTopButton();
    
    // Intersection Observer for fade-in animations
    const fadeObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, fadeObserverOptions);
    
    // Intersection Observer for slide-up animations
    const slideObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, slideObserverOptions);
    
    // Intersection Observer for scale animations
    const scaleObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-scale-in');
            }
        });
    }, scaleObserverOptions);
    
    // Observe elements for different animations
    const fadeElements = document.querySelectorAll('.curso-card, .diplomado-card, .instructor-location');
    fadeElements.forEach(el => fadeObserver.observe(el));
    
    const slideElements = document.querySelectorAll('section h2, section h3, .mission-text, .contact-info');
    slideElements.forEach(el => slideObserver.observe(el));
    
    const scaleElements = document.querySelectorAll('.hero-content, .instructor-photo');
    scaleElements.forEach(el => scaleObserver.observe(el));
    
    // Subtle parallax effect for hero section
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            const heroHeight = heroSection.offsetHeight;
            
            // Only apply parallax while hero is visible
            if (scrolled < heroHeight) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

/**
 * Create scroll to top button
 */
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Accessibility Enhancements
 */
function initAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main-content';
    }
    
    // Keyboard navigation for cards
    const cards = document.querySelectorAll('.curso-card, .diplomado-card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);
}

/**
 * Utility function to announce messages to screen readers
 */
function announceToScreenReader(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', debounce(() => {
    // Update sliders on resize
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(slider => {
        // Trigger slider update if slider instance exists
        const sliderId = slider.closest('[id]')?.id;
        if (sliderId && window[sliderId + 'Instance']) {
            window[sliderId + 'Instance'].updateSlider();
        }
    });
}, 250));

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Error handling for failed operations
 */
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could implement error reporting here
});

/**
 * Performance monitoring
 */
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}