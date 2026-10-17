import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { loadShows, loadSortOption, saveShows, saveSortOption } from '../services/storage'
import { showsSlice } from './shows-slice'

/** Combines every slice into the app's single reducer. Add new slices here. */
const rootReducer = combineSlices(showsSlice)

/** The whole app state: `{ shows: { shows, sortMethod } }`. */
export type RootState = ReturnType<typeof rootReducer>

/**
 * Loads what was saved last time. Anything that isn't saved starts from the slice's initial state
 * (no shows, `date-newest`).
 *
 * @returns The state to start the store with.
 * @throws If the saved data is invalid, or the browser blocks access to storage.
 */
const loadSavedState = (): RootState => {
  const initialShowsState = showsSlice.getInitialState()
  return {
    shows: {
      shows: loadShows() ?? initialShowsState.shows,
      sortMethod: loadSortOption() ?? initialShowsState.sortMethod,
    },
  }
}

/**
 * Creates the app's Redux store, starting from the saved data. Storage is the single source of
 * truth for the data: the store can't be given starting data any other way. (Once the app uses an
 * API, the store will start empty and load from the API instead.)
 *
 * Side effect: reads localStorage. Tests set up data by saving it first, e.g. with `saveShows`.
 *
 * @returns The store.
 * @throws If the saved data is invalid, or the browser blocks access to storage.
 */
export const createAppStore = () => configureStore({ reducer: rootReducer, preloadedState: loadSavedState() })

/** The app's store type. */
export type AppStore = ReturnType<typeof createAppStore>

/** The store's `dispatch` function type, aware of every action. */
export type AppDispatch = AppStore['dispatch']

/**
 * Saves the shows and the sort method whenever they change.
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
  let { shows: lastSavedShows, sortMethod: lastSavedSortMethod } = store.getState().shows

  return store.subscribe(() => {
    const { shows, sortMethod } = store.getState().shows
    if (shows !== lastSavedShows) {
      lastSavedShows = shows
      saveShows(shows)
    }
    if (sortMethod !== lastSavedSortMethod) {
      lastSavedSortMethod = sortMethod
      saveSortOption(sortMethod)
    }
  })
}
