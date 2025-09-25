/**
 * Accessible Carousel Component
 * Features: Touch gestures, keyboard navigation, autoplay, ARIA support
 */
class AccessibleCarousel {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.track = this.element.querySelector('.carousel-track');
        this.slides = Array.from(this.element.querySelectorAll('.carousel-slide'));
        this.prevBtn = this.element.querySelector('.carousel-prev');
        this.nextBtn = this.element.querySelector('.carousel-next');
        this.indicatorsContainer = this.element.querySelector('.carousel-indicators');
        
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.startX = 0;
        this.isDragging = false;

        this.options = {
            autoplay: false,
            autoplayDelay: 5000,
            loop: true,
            touchEnabled: true,
            pauseOnHover: true,
            ...options
        };

        this.init();
    }

    init() {
        if (!this.element || !this.track || this.slides.length === 0) {
            console.error('Carousel elements not found');
            return;
        }

        this.setupAria();
        this.createIndicators();
        this.bindEvents();
        this.updateSlide();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    setupAria() {
        this.element.setAttribute('role', 'region');
        this.element.setAttribute('aria-label', 'Image carousel');
        this.element.setAttribute('aria-live', 'polite');
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} of ${this.slides.length}`);
        });
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;

        this.indicatorsContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
        
        this.indicators = Array.from(this.indicatorsContainer.querySelectorAll('.carousel-indicator'));
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        this.element.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Touch events
        if (this.options.touchEnabled) {
            this.bindTouchEvents();
        }

        // Pause/resume autoplay
        if (this.options.pauseOnHover && this.options.autoplay) {
            this.element.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.element.addEventListener('mouseleave', () => this.startAutoplay());
            this.element.addEventListener('focusin', () => this.pauseAutoplay());
            this.element.addEventListener('focusout', () => this.startAutoplay());
        }
    }

    bindTouchEvents() {
        this.element.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.isDragging = true;
            this.pauseAutoplay();
        }, { passive: true });

        this.element.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
        }, { passive: false });

        this.element.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = this.startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.isDragging = false;
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }, { passive: true });
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        const nextIndex = this.currentIndex < this.slides.length - 1 ? 
            this.currentIndex + 1 : (this.options.loop ? 0 : this.currentIndex);
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        const prevIndex = this.currentIndex > 0 ? 
            this.currentIndex - 1 : (this.options.loop ? this.slides.length - 1 : this.currentIndex);
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (index === this.currentIndex || this.isTransitioning || index < 0 || index >= this.slides.length) {
            return;
        }
        
        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateSlide();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600); // Match CSS transition duration

        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent('carousel:change', {
            detail: { activeIndex: index, activeSlide: this.slides[index] }
        }));
    }

    updateSlide() {
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        if (this.indicators) {
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
                indicator.setAttribute('aria-pressed', index === this.currentIndex ? 'true' : 'false');
            });
        }

        // Update navigation buttons state
        if (!this.options.loop) {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentIndex === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
            }
        }
    }

    startAutoplay() {
        if (this.autoplayInterval) this.pauseAutoplay();
        
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

    getCurrentSlide() {
        return {
            index: this.currentIndex,
            slide: this.slides[this.currentIndex]
        };
    }

    destroy() {
        this.pauseAutoplay();
        // Remove event listeners and cleanup
        this.element.removeEventListener('keydown', this.handleKeydown);
        // Add more cleanup as needed
    }
}