import { describe, expect, it } from 'vitest'
import type { Show } from '../types/show'
import { addShow, deleteShow, selectShows, showsSlice, updateShow } from './shows-slice'

const severance: Show = { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 }
const breakingBad: Show = { id: '2', name: 'Breaking Bad', status: 'completed', rating: 4.7 }
const reducer = showsSlice.reducer

describe('shows slice', () => {
  it('addShow adds the show to the end with a new unique ID', () => {
    const input = { name: 'Ted Lasso', status: 'completed', rating: 4.3 } as const
    const firstAction = addShow(input)
    const secondAction = addShow(input)

    const shows = reducer([severance], firstAction)
    expect(shows).toEqual([severance, { ...input, id: firstAction.payload.id }])
    expect(firstAction.payload.id).toEqual(expect.any(String))
    expect(firstAction.payload.id).not.toBe(secondAction.payload.id)
  })

  it('updateShow replaces the show with the same ID and keeps the order', () => {
    const updatedSeverance: Show = { ...severance, status: 'completed', dateCompleted: '2025-03-21' }
    expect(reducer([severance, breakingBad], updateShow(updatedSeverance))).toEqual([updatedSeverance, breakingBad])
  })

  it('updateShow does nothing for an unknown ID', () => {
    const shows = [severance]
    expect(reducer(shows, updateShow({ ...breakingBad, id: 'missing' }))).toEqual(shows)
  })

  it('deleteShow removes only the show with the given ID', () => {
    expect(reducer([severance, breakingBad], deleteShow('1'))).toEqual([breakingBad])
  })

  it('selectShows returns the list', () => {
    expect(selectShows({ shows: [severance] })).toEqual([severance])
  })
})
