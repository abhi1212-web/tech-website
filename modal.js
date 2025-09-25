class AccessibleModal {
  constructor(modalElement, options = {}) {
    if (!modalElement) {
      throw new Error("Modal element is required.");
    }

    this.modal = modalElement;
    this.dialog = this.modal.querySelector("[role='dialog']");
    this.closeBtn = this.modal.querySelector("[data-modal-close]");
    this.options = { onOpen: null, onClose: null, ...options };

    this.focusableElements = [];
    this.firstFocus = null;
    this.lastFocus = null;
    this.activeElementBeforeOpen = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.trapFocus = this.trapFocus.bind(this);

    this.init();
  }

  init() {
    // Accessibility attributes
    this.modal.setAttribute("aria-hidden", "true");
    if (this.dialog) {
      this.dialog.setAttribute("aria-modal", "true");
      this.dialog.setAttribute("role", "dialog");
    }

    // Close button event
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
  }

  open() {
    this.activeElementBeforeOpen = document.activeElement;

    this.modal.style.display = "block";
    this.modal.removeAttribute("aria-hidden");

    this.updateFocusableElements();

    // Focus first element or dialog
    if (this.firstFocus) {
      this.firstFocus.focus();
    } else if (this.dialog) {
      this.dialog.focus();
    }

    document.addEventListener("keydown", this.handleKeyDown);
    this.modal.addEventListener("keydown", this.trapFocus);

    if (typeof this.options.onOpen === "function") {
      this.options.onOpen();
    }
  }

  close() {
    this.modal.setAttribute("aria-hidden", "true");
    this.modal.style.display = "none";

    document.removeEventListener("keydown", this.handleKeyDown);
    this.modal.removeEventListener("keydown", this.trapFocus);

    // Restore focus
    if (this.activeElementBeforeOpen) {
      this.activeElementBeforeOpen.focus();
    }

    if (typeof this.options.onClose === "function") {
      this.options.onClose();
    }
  }

  updateFocusableElements() {
    const selectors =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    this.focusableElements = Array.from(
      this.modal.querySelectorAll(selectors)
    ).filter((el) => el.offsetParent !== null);

    this.firstFocus = this.focusableElements[0] || null;
    this.lastFocus = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  trapFocus(event) {
    if (event.key !== "Tab") return;

    if (event.shiftKey) {
      if (document.activeElement === this.firstFocus) {
        event.preventDefault();
        this.lastFocus.focus();
      }
    } else {
      if (document.activeElement === this.lastFocus) {
        event.preventDefault();
        this.firstFocus.focus();
      }
    }
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }
}

export default AccessibleModal;
