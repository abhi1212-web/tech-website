/**
 * Accessible Modal Component
 * Features: Focus trap, keyboard navigation, ARIA support
 */
class AccessibleModal {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.modal = this.element.querySelector('.modal');
        this.closeBtn = this.element.querySelector('.modal-close');
        this.options = {
            closeOnOverlay: true,
            closeOnEsc: true,
            restoreFocus: true,
            ...options
        };
        this.focusableElements = null;
        this.previousFocus = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.element || !this.modal) {
            console.error('Modal elements not found');
            return;
        }

        this.bindEvents();
        this.setupAria();
    }

    bindEvents() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay click
        this.element.addEventListener('click', (e) => {
            if (this.options.closeOnOverlay && e.target === this.element) {
                this.close();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    setupAria() {
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-hidden', 'true');
    }

    open() {
        if (this.isOpen) return;

        this.previousFocus = document.activeElement;
        this.element.classList.add('active');
        this.element.setAttribute('aria-hidden', 'false');
        this.isOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Set focus after animation
        setTimeout(() => {
            this.setFocusableElements();
            if (this.focusableElements.length > 0) {
                this.focusableElements[0].focus();
            }
        }, 300);

        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent('modal:open'));
    }

    close() {
        if (!this.isOpen) return;

        this.element.classList.remove('active');
        this.element.setAttribute('aria-hidden', 'true');
        this.isOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';

        // Restore focus
        if (this.options.restoreFocus && this.previousFocus) {
            this.previousFocus.focus();
        }

        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent('modal:close'));
    }

    handleKeydown(e) {
        if (!this.isOpen) return;

        if (e.key === 'Escape' && this.options.closeOnEsc) {
            this.close();
            return;
        }

        if (e.key === 'Tab') {
            this.handleTabKeydown(e);
        }
    }

    handleTabKeydown(e) {
        if (!this.focusableElements || this.focusableElements.length === 0) return;

        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setFocusableElements() {
        this.focusableElements = getFocusableElements(this.modal);
    }

    destroy() {
        this.close();
        // Remove event listeners if needed
    }
}