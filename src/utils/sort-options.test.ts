import { describe, expect, it } from 'vitest'
import { isSortOption } from './sort-options'

describe('isSortOption', () => {
  it.each(['date-newest', 'name-z-a'])('accepts %s', (value) => {
    expect(isSortOption(value)).toBe(true)
  })

  it.each(['newest', '', 42, null, undefined])('rejects %s', (value) => {
    expect(isSortOption(value)).toBe(false)
  })
})
