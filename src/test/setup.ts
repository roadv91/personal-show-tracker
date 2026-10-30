import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

// jsdom doesn't implement <dialog>'s showModal() and close(), so add minimal versions that only
// toggle `open` and fire `close` (no focus trapping or top layer)
HTMLDialogElement.prototype.showModal ??= function showModal(this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close ??= function close(this: HTMLDialogElement) {
  this.open = false
  this.dispatchEvent(new Event('close'))
}

// The store loads from localStorage, so start every test with nothing saved
beforeEach(() => localStorage.clear())
