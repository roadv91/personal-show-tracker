import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Show } from '../types/show'
import { loadShows, loadSortOption, saveShows, saveSortOption, storageKeys } from './storage'

const shows: Show[] = [
  { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8, notes: 'Mind-bending.' },
  { id: '2', name: 'Breaking Bad', status: 'completed', rating: 4.7, dateCompleted: '2024-08-12' },
  { id: '3', name: 'The Bear', status: 'dropped' },
]

afterEach(() => vi.restoreAllMocks())

describe('shows', () => {
  it('loads what was saved', () => {
    saveShows(shows)
    expect(loadShows()).toEqual(shows)
  })

  it('loads undefined when nothing is saved', () => {
    expect(loadShows()).toBeUndefined()
  })

  it('throws for invalid JSON', () => {
    localStorage.setItem(storageKeys.shows, '{not json')
    expect(() => loadShows()).toThrow(SyntaxError)
  })

  it.each([
    ['null', 'null'],
    ['not an array', '{"id":"1"}'],
    ['a show missing its name', '[{"id":"1","status":"ongoing","rating":4}]'],
    ['an unknown status', '[{"id":"1","name":"Severance","status":"paused","rating":4}]'],
    ['a rating that is not a number', '[{"id":"1","name":"Severance","status":"ongoing","rating":"4"}]'],
  ])('throws for %s', (_description, savedValue) => {
    localStorage.setItem(storageKeys.shows, savedValue)
    expect(() => loadShows()).toThrow('The saved shows are invalid')
  })
})

describe('sort option', () => {
  it('loads what was saved', () => {
    saveSortOption('rating-highest')
    expect(loadSortOption()).toBe('rating-highest')
  })

  it('loads undefined when nothing is saved', () => {
    expect(loadSortOption()).toBeUndefined()
  })

  it('throws for invalid JSON', () => {
    localStorage.setItem(storageKeys.sortOption, 'rating-highest')
    expect(() => loadSortOption()).toThrow(SyntaxError)
  })

  it('throws for an unknown sort option', () => {
    localStorage.setItem(storageKeys.sortOption, '"newest"')
    expect(() => loadSortOption()).toThrow('The saved sort choice is invalid')
  })
})

describe('when the browser refuses storage access', () => {
  it('throws when loading', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => loadShows()).toThrow('blocked')
    expect(() => loadSortOption()).toThrow('blocked')
  })

  it('throws when saving', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(() => saveShows(shows)).toThrow('quota exceeded')
    expect(() => saveSortOption('date-oldest')).toThrow('quota exceeded')
  })
})
