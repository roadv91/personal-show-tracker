import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { saveShows, saveSortOption } from '../services/storage'
import { createAppStore, type RootState } from '../store/store'

/**
 * Renders a component inside a Redux `Provider` with its own fresh store, so tests don't share state.
 *
 * The store loads from localStorage like the real app, so the given data is saved there first.
 * Side effect: writes to localStorage (the test setup clears it before each test).
 *
 * @param ui - The element to render.
 * @param savedState - Data to save before the store is created, e.g. `{ shows: [...] }`.
 * @returns Testing Library's render result, plus the store so tests can dispatch or read state.
 */
export const renderWithStore = (ui: ReactElement, savedState: Partial<RootState> = {}) => {
  if (savedState.shows) saveShows(savedState.shows)
  if (savedState.sort) saveSortOption(savedState.sort)
  const store = createAppStore()
  return { store, ...render(<Provider store={store}>{ui}</Provider>) }
}
