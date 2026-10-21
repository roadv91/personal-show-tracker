import { describe, expect, it } from 'vitest'
import type { Show } from '../types/show'
import { sortOptions, type SortOption } from './sort-options'
import { getNextSortOption, getSortState, sortShows } from './sort-shows'

const alpha: Show = { id: '1', name: 'alpha', status: 'completed', rating: 3, dateCompleted: '2024-01-01' }
const bravo: Show = { id: '2', name: 'Bravo', status: 'completed', rating: 5, dateCompleted: '2025-06-01' }
const charlie: Show = { id: '3', name: 'Charlie', status: 'completed', rating: 1, dateCompleted: '2023-03-01' }
const noDateZulu: Show = { id: '4', name: 'Zulu', status: 'completed', rating: 4 }
const noDateAble: Show = { id: '5', name: 'Able', status: 'completed', rating: 2 }
/** Ongoing, so its stored date is ignored. */
const ongoing: Show = { id: '6', name: 'Delta', status: 'ongoing', rating: 0, dateCompleted: '2020-01-01' }

const names = (shows: Show[]) => shows.map((show) => show.name)

describe('sortShows', () => {
  const shows = [bravo, charlie, alpha]

  it.each([
    ['name-a-z', ['alpha', 'Bravo', 'Charlie']],
    ['name-z-a', ['Charlie', 'Bravo', 'alpha']],
    ['date-oldest', ['Charlie', 'alpha', 'Bravo']],
    ['date-newest', ['Bravo', 'alpha', 'Charlie']],
    ['rating-lowest', ['Charlie', 'alpha', 'Bravo']],
    ['rating-highest', ['Bravo', 'alpha', 'Charlie']],
  ] as const)('sorts by %s', (sortOption, expected) => {
    expect(names(sortShows(shows, sortOption))).toEqual(expected)
  })

  it.each(['date-oldest', 'date-newest'] as const)('keeps shows without a date last for %s, sorted by name', (option) => {
    const sorted = sortShows([noDateZulu, alpha, ongoing, noDateAble, bravo], option)
    expect(names(sorted).slice(-3)).toEqual(['Able', 'Delta', 'Zulu'])
  })

  it.each(['rating-lowest', 'rating-highest', 'date-oldest', 'date-newest'] as const)(
    'sorts ties by name A to Z for %s',
    (option) => {
      const tiedA: Show = { ...alpha, id: 'a', name: 'Apple', rating: 3, dateCompleted: '2024-01-01' }
      const tiedB: Show = { ...alpha, id: 'b', name: 'banana', rating: 3, dateCompleted: '2024-01-01' }
      expect(names(sortShows([tiedB, tiedA], option))).toEqual(['Apple', 'banana'])
    },
  )

  it('does not change the given array', () => {
    const original = [bravo, charlie, alpha]
    sortShows(original, 'name-a-z')
    expect(original).toEqual([bravo, charlie, alpha])
  })
})

describe('getNextSortOption', () => {
  it('starts a newly clicked column ascending', () => {
    expect(getNextSortOption('date-newest', 'name')).toBe('name-a-z')
    expect(getNextSortOption('name-z-a', 'rating')).toBe('rating-lowest')
  })

  it('switches the direction of the sorted column back and forth', () => {
    expect(getNextSortOption('date-newest', 'date')).toBe('date-oldest')
    expect(getNextSortOption('date-oldest', 'date')).toBe('date-newest')
    expect(getNextSortOption('rating-lowest', 'rating')).toBe('rating-highest')
  })
})

describe('getSortState', () => {
  it('knows every sort option', () => {
    sortOptions.forEach(({ value }: { value: SortOption }) => expect(getSortState(value)).toBeDefined())
  })
})
