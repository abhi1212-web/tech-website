/**
 * @jest-environment jsdom
 */
import AccessibleModal from "./modal.js";

let modalElement, modal;

beforeEach(() => {
  document.body.innerHTML = `
    <div class="modal" id="testModal">
      <div class="modal-dialog" role="dialog" aria-labelledby="title" aria-describedby="desc" tabindex="-1">
        <h2 id="title">Test</h2>
        <p id="desc">Desc</p>
        <button data-modal-close>Close</button>
      </div>
    </div>
  `;
  modalElement = document.getElementById("testModal");
  modal = new AccessibleModal(modalElement);
});

test("modal opens and sets aria-hidden=false", () => {
  modal.open();
  expect(modalElement.getAttribute("aria-hidden")).toBeNull();
});

test("modal closes and restores aria-hidden", () => {
  modal.open();
  modal.close();
  expect(modalElement.getAttribute("aria-hidden")).toBe("true");
});

test("pressing Escape closes the modal", () => {
  modal.open();
  const event = new KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(event);
  expect(modalElement.getAttribute("aria-hidden")).toBe("true");
});
