import { describe, expect, it } from 'vitest'
import { loadShows, loadSortOption, saveShows, saveSortOption, storageKeys } from '../services/storage'
import type { Show } from '../types/show'
import { deleteShow } from './shows-slice'
import { setSort } from './sort-slice'
import { createAppStore, saveStateOnChange } from './store'

const severance: Show = { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 }

describe('createAppStore', () => {
  it('starts from the saved shows and sort choice', () => {
    saveShows([severance])
    saveSortOption('name-a-z')
    expect(createAppStore().getState()).toEqual({ shows: [severance], sort: 'name-a-z' })
  })

  it('starts with no shows and date-newest when nothing is saved', () => {
    expect(createAppStore().getState()).toEqual({ shows: [], sort: 'date-newest' })
  })

  it('uses the slice defaults only for the part that is not saved', () => {
    saveSortOption('name-a-z')
    expect(createAppStore().getState()).toEqual({ shows: [], sort: 'name-a-z' })
  })

  it('keeps an empty saved list', () => {
    saveShows([])
    expect(createAppStore().getState().shows).toEqual([])
  })

  it('throws instead of falling back when the saved data is broken', () => {
    localStorage.setItem(storageKeys.shows, '{not json')
    expect(() => createAppStore()).toThrow()
  })
})

describe('saveStateOnChange', () => {
  it('saves the shows and sort choice after they change', () => {
    saveShows([severance])
    const store = createAppStore()
    saveStateOnChange(store)

    store.dispatch(deleteShow('1'))
    expect(loadShows()).toEqual([])

    store.dispatch(setSort('rating-highest'))
    expect(loadSortOption()).toBe('rating-highest')
  })

  it('only saves the part that changed', () => {
    const store = createAppStore()
    saveStateOnChange(store)

    store.dispatch(setSort('rating-highest'))
    expect(localStorage.getItem(storageKeys.shows)).toBeNull()
  })

  it('stops saving once unsubscribed', () => {
    const store = createAppStore()
    const stopSaving = saveStateOnChange(store)
    stopSaving()

    store.dispatch(setSort('rating-highest'))
    expect(loadSortOption()).toBeUndefined()
  })
})
