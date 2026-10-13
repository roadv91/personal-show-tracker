import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { loadShows, loadSortOption, saveShows, saveSortOption } from '../services/storage'
import { defaultSortOption } from '../utils/sort-options'
import { sampleShows } from './sample-shows'
import { showsSlice } from './shows-slice'
import { sortSlice } from './sort-slice'

/** Combines every slice into the app's single reducer. */
const rootReducer = combineSlices(showsSlice, sortSlice)

/** The whole app state: `{ shows, sort }`. */
export type RootState = ReturnType<typeof rootReducer>

/**
 * Creates a Redux store for the app. Tests call it to get a fresh store with their own data.
 *
 * @param preloadedState - State to start from instead of each slice's initial state.
 * @returns The store.
 */
export const createAppStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState })

/** The app's store type. */
export type AppStore = ReturnType<typeof createAppStore>

/** The store's `dispatch` function type, aware of every action. */
export type AppDispatch = AppStore['dispatch']

/**
 * Builds the state the app starts with: what was saved last time, or the defaults (the sample
 * shows and `date-newest`) only when nothing is saved yet.
 *
 * @returns The starting state.
 * @throws If the saved data is invalid, or the browser blocks access to storage.
 */
export const loadInitialState = (): RootState => ({
  shows: loadShows() ?? sampleShows,
  sort: loadSortOption() ?? defaultSortOption,
})

/**
 * Saves the shows and the sort choice whenever they change.
 * Side effect: subscribes to the store and writes to localStorage through the storage module.
 *
 * Each part is only saved when it actually changed, so e.g. changing the sort doesn't rewrite every show.
 * If saving fails (storage blocked or full), the error is thrown from the `dispatch` call that
 * caused the change.
 *
 * @param store - The store to watch.
 * @returns A function that stops saving.
 */
export const saveStateOnChange = (store: AppStore): (() => void) => {
  let { shows: lastSavedShows, sort: lastSavedSortOption } = store.getState()

  return store.subscribe(() => {
    const { shows, sort } = store.getState()
    if (shows !== lastSavedShows) {
      lastSavedShows = shows
      saveShows(shows)
    }
    if (sort !== lastSavedSortOption) {
      lastSavedSortOption = sort
      saveSortOption(sort)
    }
  })
}
