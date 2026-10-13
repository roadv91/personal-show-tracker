import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createAppStore, type RootState } from '../store/store'

/**
 * Renders a component inside a Redux `Provider` with its own fresh store, so tests don't share state.
 *
 * @param ui - The element to render.
 * @param preloadedState - State to start the store with, e.g. `{ shows: [...] }`.
 * @returns Testing Library's render result, plus the store so tests can dispatch or read state.
 */
export const renderWithStore = (ui: ReactElement, preloadedState?: Partial<RootState>) => {
  const store = createAppStore(preloadedState)
  return { store, ...render(<Provider store={store}>{ui}</Provider>) }
}
