import type { Show } from '../types/show'
import { getCompletionDate } from './get-completion-date'
import type { SortOption } from './sort-options'

/** A table column the shows can be sorted by. */
export type SortColumn = 'name' | 'date' | 'rating'

/** Which way a column is sorted. Matches the values of the `aria-sort` attribute. */
export type SortDirection = 'ascending' | 'descending'

/** The sort option for each column and direction. */
const sortOptionsByColumn: Record<SortColumn, Record<SortDirection, SortOption>> = {
  name: { ascending: 'name-a-z', descending: 'name-z-a' },
  date: { ascending: 'date-oldest', descending: 'date-newest' },
  rating: { ascending: 'rating-lowest', descending: 'rating-highest' },
}

/**
 * Works out which column and direction a sort option stands for.
 *
 * @param sortOption - The current sort option.
 * @returns The sorted column and its direction.
 */
export const getSortState = (sortOption: SortOption): { column: SortColumn; direction: SortDirection } => {
  for (const column of Object.keys(sortOptionsByColumn) as SortColumn[]) {
    for (const direction of ['ascending', 'descending'] as const) {
      if (sortOptionsByColumn[column][direction] === sortOption) return { column, direction }
    }
  }
  throw new Error(`Unknown sort option: ${sortOption}`)
}

/**
 * Gets the sort option a click on a column header should switch to. A new column starts
 * ascending; the column that's already sorted switches direction.
 *
 * @param current - The current sort option.
 * @param clickedColumn - The column whose header was clicked.
 * @returns The sort option to switch to.
 */
export const getNextSortOption = (current: SortOption, clickedColumn: SortColumn): SortOption => {
  const { column, direction } = getSortState(current)
  const nextDirection = column === clickedColumn && direction === 'ascending' ? 'descending' : 'ascending'
  return sortOptionsByColumn[clickedColumn][nextDirection]
}

/**
 * Sorts shows by name, A to Z, ignoring upper/lower case.
 *
 * @param first - A show.
 * @param second - Another show.
 * @returns A negative, zero, or positive number, as for `Array.sort`.
 */
const compareNames = (first: Show, second: Show) =>
  first.name.localeCompare(second.name, undefined, { sensitivity: 'base' })

/**
 * Returns the shows sorted by the given option. Doesn't change the given array.
 *
 * Shows without a completion date (see {@link getCompletionDate}) always come last, in both
 * directions. Shows with equal values are sorted by name, A to Z.
 *
 * @param shows - The shows to sort.
 * @param sortOption - How to sort them.
 * @returns A new, sorted array.
 */
export const sortShows = (shows: readonly Show[], sortOption: SortOption): Show[] => {
  const { column, direction } = getSortState(sortOption)
  const sign = direction === 'ascending' ? 1 : -1

  return [...shows].sort((first, second) => {
    if (column === 'name') return sign * compareNames(first, second)

    if (column === 'rating') {
      return sign * (first.rating - second.rating) || compareNames(first, second)
    }

    const firstDate = getCompletionDate(first)
    const secondDate = getCompletionDate(second)
    if (!firstDate && !secondDate) return compareNames(first, second)
    if (!firstDate) return 1
    if (!secondDate) return -1
    // ISO dates (YYYY-MM-DD) sort correctly as plain strings
    return sign * firstDate.localeCompare(secondDate) || compareNames(first, second)
  })
}
