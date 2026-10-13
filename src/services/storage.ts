/**
 * The only module in the app that reads or writes localStorage.
 *
 * - When nothing is saved yet, loading returns `undefined`, so callers can use their defaults.
 * - Anything else that goes wrong throws, so the app can show an error screen instead of silently
 *   losing or replacing data: saved data that isn't valid JSON or has the wrong shape, or the
 *   browser refusing access to storage (e.g. it's blocked, or full when saving).
 */
import { showStatuses, type Show } from '../types/show'
import { isSortOption, type SortOption } from '../utils/sort-options'

/** localStorage keys, prefixed with the app name so they can't clash with other apps on the same origin. */
export const storageKeys = {
  shows: 'personal-show-tracker/shows',
  sortOption: 'personal-show-tracker/sort-option',
} as const

/**
 * Reads and parses a JSON value from localStorage.
 *
 * @param key - The localStorage key.
 * @returns The parsed value, or `undefined` if nothing is saved under the key.
 * @throws If the saved value isn't valid JSON, or the browser blocks access to storage.
 */
const readJson = (key: string): unknown => {
  const savedValue = localStorage.getItem(key)
  return savedValue === null ? undefined : JSON.parse(savedValue)
}

/**
 * Writes a value to localStorage as JSON. Side effect: changes localStorage.
 *
 * @param key - The localStorage key.
 * @param value - The value to save.
 * @throws If the browser blocks access to storage or storage is full.
 */
const writeJson = (key: string, value: unknown): void => localStorage.setItem(key, JSON.stringify(value))

/**
 * Checks whether a value has the shape of a {@link Show}, e.g. when reading saved data.
 *
 * @param value - Any value.
 * @returns `true` if it's a valid show.
 */
const isShow = (value: unknown): value is Show => {
  if (typeof value !== 'object' || value === null) return false
  const show = value as Record<string, unknown>
  return (
    typeof show.id === 'string' &&
    typeof show.name === 'string' &&
    showStatuses.includes(show.status as Show['status']) &&
    typeof show.rating === 'number' &&
    (show.dateCompleted === undefined || typeof show.dateCompleted === 'string') &&
    (show.notes === undefined || typeof show.notes === 'string')
  )
}

/**
 * Loads the saved shows.
 *
 * @returns The shows, or `undefined` if none are saved.
 * @throws If the saved shows are invalid, or the browser blocks access to storage.
 */
export const loadShows = (): Show[] | undefined => {
  const savedShows = readJson(storageKeys.shows)
  if (savedShows === undefined) return undefined
  if (!Array.isArray(savedShows) || !savedShows.every(isShow)) {
    throw new Error('The saved shows are invalid')
  }
  return savedShows
}

/**
 * Saves the shows. Side effect: changes localStorage.
 *
 * @param shows - The shows to save.
 * @throws If the browser blocks access to storage or storage is full.
 */
export const saveShows = (shows: Show[]): void => writeJson(storageKeys.shows, shows)

/**
 * Loads the saved sort choice.
 *
 * @returns The sort choice, or `undefined` if none is saved.
 * @throws If the saved sort choice isn't a known option, or the browser blocks access to storage.
 */
export const loadSortOption = (): SortOption | undefined => {
  const savedSortOption = readJson(storageKeys.sortOption)
  if (savedSortOption === undefined) return undefined
  if (!isSortOption(savedSortOption)) {
    throw new Error('The saved sort choice is invalid')
  }
  return savedSortOption
}

/**
 * Saves the sort choice. Side effect: changes localStorage.
 *
 * @param sortOption - The sort choice to save.
 * @throws If the browser blocks access to storage or storage is full.
 */
export const saveSortOption = (sortOption: SortOption): void => writeJson(storageKeys.sortOption, sortOption)
