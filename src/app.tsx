import type { FC } from 'react'
import './index.css'

/**
 * Root component of the Personal Show Tracker app.
 *
 * @returns The top-level page layout.
 */
export const App: FC = () => (
  <main className="flex min-h-screen items-center justify-center">
    <h1 className="text-4xl font-bold">Personal Show Tracker</h1>
  </main>
)
