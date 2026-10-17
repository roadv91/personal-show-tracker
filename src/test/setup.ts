import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

// The store loads from localStorage, so start every test with nothing saved
beforeEach(() => localStorage.clear())
