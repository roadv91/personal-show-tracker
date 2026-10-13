import { describe, expect, it } from 'vitest'
import { selectSortOption, setSort, sortSlice } from './sort-slice'

describe('sort slice', () => {
  it('starts on date-newest', () => {
    expect(sortSlice.reducer(undefined, { type: 'unknown' })).toBe('date-newest')
  })

  it('setSort changes the sort choice', () => {
    expect(sortSlice.reducer('date-newest', setSort('name-a-z'))).toBe('name-a-z')
  })

  it('selectSortOption returns the sort choice', () => {
    expect(selectSortOption({ sort: 'rating-lowest' })).toBe('rating-lowest')
  })
})
