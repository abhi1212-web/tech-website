/**
 * Accessible Tabs Component
 * Features: Keyboard navigation, ARIA support, configurable options
 */
class AccessibleTabs {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.tabList = this.element.querySelector('[role="tablist"]');
        this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
        this.panels = Array.from(this.element.querySelectorAll('[role="tabpanel"]'));
        this.currentIndex = 0;
        this.options = {
            defaultTab: 0,
            activateOnFocus: false,
            ...options
        };
        this.init();
    }

    init() {
        if (!this.element || !this.tabList || this.tabs.length === 0) {
            console.error('Tabs elements not found');
            return;
        }

        this.setupTabs();
        this.setupPanels();
        this.bindEvents();
        this.selectTab(this.options.defaultTab);
    }

    setupTabs() {
        this.tabs.forEach((tab, index) => {
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
            tab.setAttribute('id', `tab-${index}`);
        });
    }

    setupPanels() {
        this.panels.forEach((panel, index) => {
            panel.setAttribute('aria-labelledby', `tab-${index}`);
            panel.setAttribute('tabindex', '0');
            panel.classList.remove('active');
        });
    }

    bindEvents() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.selectTab(index));
            tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
            
            if (this.options.activateOnFocus) {
                tab.addEventListener('focus', () => this.selectTab(index));
            }
        });
    }

    selectTab(index) {
        if (index < 0 || index >= this.tabs.length || index === this.currentIndex) return;

        // Update previous tab
        this.tabs[this.currentIndex].setAttribute('aria-selected', 'false');
        this.tabs[this.currentIndex].setAttribute('tabindex', '-1');
        this.tabs[this.currentIndex].classList.remove('active');
        this.panels[this.currentIndex].classList.remove('active');

        // Update new tab
        this.tabs[index].setAttribute('aria-selected', 'true');
        this.tabs[index].setAttribute('tabindex', '0');
        this.tabs[index].classList.add('active');
        this.panels[index].classList.add('active');

        // Focus if not using activateOnFocus
        if (!this.options.activateOnFocus) {
            this.tabs[index].focus();
        }

        this.currentIndex = index;

        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent('tabs:change', {
            detail: { activeIndex: index, activeTab: this.tabs[index] }
        }));
    }

    handleKeydown(e, index) {
        let newIndex = index;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = index > 0 ? index - 1 : this.tabs.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                newIndex = index < this.tabs.length - 1 ? index + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = this.tabs.length - 1;
                break;
            default:
                return;
        }

        this.selectTab(newIndex);
    }

    getActiveTab() {
        return {
            index: this.currentIndex,
            tab: this.tabs[this.currentIndex],
            panel: this.panels[this.currentIndex]
        };
    }

    destroy() {
        // Remove event listeners if needed
    }
}