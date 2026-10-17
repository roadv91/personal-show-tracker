import { describe, expect, it } from 'vitest'
import type { Show } from '../types/show'
import {
  addShow,
  deleteShow,
  selectShows,
  selectSortMethod,
  setSortMethod,
  showsSlice,
  updateShow,
  type ShowsState,
} from './shows-slice'

const severance: Show = { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 }
const breakingBad: Show = { id: '2', name: 'Breaking Bad', status: 'completed', rating: 4.7 }
const reducer = showsSlice.reducer

/**
 * A sort method that isn't the default, so tests can tell "left alone" apart from "reset to the default".
 */
const sortMethod = 'rating-highest'

/**
 * Builds slice state with the given shows and {@link sortMethod}.
 * @param shows - The shows in the state.
 * @returns The slice state.
 */
const stateWith = (shows: Show[]): ShowsState => ({ shows, sortMethod })

describe('shows slice', () => {
  it('starts with no shows, sorted newest first', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ shows: [], sortMethod: 'date-newest' })
  })

  it('addShow adds each show to the end with a new unique ID, leaving the sort method alone', () => {
    const input = { name: 'Ted Lasso', status: 'completed', rating: 4.3 } as const
    const firstAction = addShow(input)
    const secondAction = addShow(input)
    expect(firstAction.payload.id).toEqual(expect.any(String))
    expect(firstAction.payload.id).not.toBe(secondAction.payload.id)

    const stateAfterFirstAdd = reducer(stateWith([severance]), firstAction)
    const stateAfterSecondAdd = reducer(stateAfterFirstAdd, secondAction)

    expect(stateAfterSecondAdd.shows).toHaveLength(3)
    expect(stateAfterSecondAdd.shows).toEqual([
      severance,
      { ...input, id: firstAction.payload.id },
      { ...input, id: secondAction.payload.id },
    ])
    expect(stateAfterSecondAdd.sortMethod).toBe(sortMethod)
  })

  it('updateShow replaces the show with the same ID, keeps the order, and leaves the sort method alone', () => {
    const updatedSeverance: Show = { ...severance, status: 'completed', dateCompleted: '2025-03-21' }
    const newState = reducer(stateWith([severance, breakingBad]), updateShow(updatedSeverance))
    expect(newState.shows).toEqual([updatedSeverance, breakingBad])
    expect(newState.sortMethod).toBe(sortMethod)
  })

  it('updateShow changes nothing for an unknown ID', () => {
    const newState = reducer(stateWith([severance]), updateShow({ ...breakingBad, id: 'missing' }))
    expect(newState.shows).toEqual([severance])
    expect(newState.sortMethod).toBe(sortMethod)
  })

  it('deleteShow removes only the show with the given ID and leaves the sort method alone', () => {
    const newState = reducer(stateWith([severance, breakingBad]), deleteShow('1'))
    expect(newState.shows).toEqual([breakingBad])
    expect(newState.sortMethod).toBe(sortMethod)
  })

  it('setSortMethod changes the sort method and leaves the shows alone', () => {
    const state = stateWith([severance])
    expect(reducer(state, setSortMethod('name-a-z'))).toEqual({ shows: [severance], sortMethod: 'name-a-z' })
  })

  it('selectShows and selectSortMethod read from the app state', () => {
    const appState = { shows: { shows: [severance], sortMethod: 'rating-lowest' as const } }
    expect(selectShows(appState)).toEqual([severance])
    expect(selectSortMethod(appState)).toBe('rating-lowest')
  })
})
