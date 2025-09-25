/**
 * Main initialization file
 * Initialize all components and set up global functionality
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Modal
    const modal = new AccessibleModal('modal', {
        closeOnOverlay: true,
        closeOnEsc: true,
        restoreFocus: true
    });

    // Initialize Tabs
    const tabs = new AccessibleTabs('tabs', {
        defaultTab: 0,
        activateOnFocus: false
    });

    // Initialize Carousel
    const carousel = new AccessibleCarousel('carousel', {
        autoplay: true,
        autoplayDelay: 4000,
        loop: true,
        touchEnabled: true,
        pauseOnHover: true
    });

    // Make components globally accessible for demo purposes
    window.modal = modal;
    window.tabs = tabs;
    window.carousel = carousel;

    // Add event listeners for component events
    modal.element.addEventListener('modal:open', () => {
        console.log('Modal opened');
    });

    modal.element.addEventListener('modal:close', () => {
        console.log('Modal closed');
    });

    tabs.element.addEventListener('tabs:change', (e) => {
        console.log('Tab changed to:', e.detail.activeIndex);
    });

    carousel.element.addEventListener('carousel:change', (e) => {
        console.log('Carousel changed to slide:', e.detail.activeIndex);
    });

    // Demo functionality - programmatic control
    setTimeout(() => {
        console.log('Demo: Programmatically switching to tab 2');
        tabs.selectTab(1);
    }, 8000);

    setTimeout(() => {
        console.log('Demo: Programmatically going to carousel slide 3');
        carousel.goToSlide(2);
    }, 12000);

    // Log APIs for testing
    console.log('=== Component APIs Loaded ===');
    console.log('Modal API:', {
        open: modal.open.bind(modal),
        close: modal.close.bind(modal)
    });
    console.log('Tabs API:', {
        selectTab: tabs.selectTab.bind(tabs),
        getActiveTab: tabs.getActiveTab.bind(tabs)
    });
    console.log('Carousel API:', {
        nextSlide: carousel.nextSlide.bind(carousel),
        prevSlide: carousel.prevSlide.bind(carousel),
        goToSlide: carousel.goToSlide.bind(carousel),
        startAutoplay: carousel.startAutoplay.bind(carousel),
        pauseAutoplay: carousel.pauseAutoplay.bind(carousel),
        getCurrentSlide: carousel.getCurrentSlide.bind(carousel)
    });
});