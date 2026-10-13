import { describe, expect, it } from 'vitest'
import { formatShowCount } from './format-show-count'

describe('formatShowCount', () => {
  it.each([
    [0, '0 shows'],
    [1, '1 show'],
    [7, '7 shows'],
  ])('describes %s as "%s"', (count, description) => {
    expect(formatShowCount(count)).toBe(description)
  })
})
