import { beforeEach, describe, expect, it } from 'vitest'
import { loadShows, loadSortOption, saveShows, saveSortOption, storageKeys } from '../services/storage'
import type { Show } from '../types/show'
import { sampleShows } from './sample-shows'
import { deleteShow } from './shows-slice'
import { setSort } from './sort-slice'
import { createAppStore, loadInitialState, saveStateOnChange } from './store'

const severance: Show = { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 }

beforeEach(() => localStorage.clear())

describe('loadInitialState', () => {
  it('uses the saved shows and sort choice', () => {
    saveShows([severance])
    saveSortOption('name-a-z')
    expect(loadInitialState()).toEqual({ shows: [severance], sort: 'name-a-z' })
  })

  it('falls back to the sample shows and date-newest when nothing is saved', () => {
    expect(loadInitialState()).toEqual({ shows: sampleShows, sort: 'date-newest' })
  })

  it('uses the defaults only for the part that is not saved', () => {
    saveSortOption('name-a-z')
    expect(loadInitialState()).toEqual({ shows: sampleShows, sort: 'name-a-z' })
  })

  it('throws instead of falling back when the saved data is broken', () => {
    localStorage.setItem(storageKeys.shows, '{not json')
    expect(() => loadInitialState()).toThrow()
  })
})

describe('saveStateOnChange', () => {
  it('saves the shows and sort choice after they change', () => {
    const store = createAppStore({ shows: [severance], sort: 'date-newest' })
    saveStateOnChange(store)

    store.dispatch(deleteShow('1'))
    expect(loadShows()).toEqual([])

    store.dispatch(setSort('rating-highest'))
    expect(loadSortOption()).toBe('rating-highest')
  })

  it('only saves the part that changed', () => {
    const store = createAppStore({ shows: [severance], sort: 'date-newest' })
    saveStateOnChange(store)

    store.dispatch(setSort('rating-highest'))
    expect(localStorage.getItem(storageKeys.shows)).toBeNull()
  })

  it('stops saving once unsubscribed', () => {
    const store = createAppStore({ shows: [severance], sort: 'date-newest' })
    const stopSaving = saveStateOnChange(store)
    stopSaving()

    store.dispatch(setSort('rating-highest'))
    expect(loadSortOption()).toBeUndefined()
  })
})
