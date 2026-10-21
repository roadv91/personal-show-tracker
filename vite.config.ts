import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site from /personal-show-tracker/, so production builds use that as
  // the base path for their asset URLs. The dev server stays at the root (http://localhost:5173/).
  base: command === 'build' ? '/personal-show-tracker/' : '/',
  test: {
    environment: 'jsdom',
    // Unit tests only; e2e specs will live outside src and run under their own runner.
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
}))
