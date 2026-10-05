import { describe, expect, it } from 'vitest'
import type { Show } from '../types/show'
import { getCompletionDate } from './get-completion-date'

const show: Show = { id: '1', name: 'Severance', status: 'completed', rating: 4.8, dateCompleted: '2025-03-21' }

describe('getCompletionDate', () => {
  it('returns the date for a completed show', () => {
    expect(getCompletionDate(show)).toBe('2025-03-21')
  })

  it('returns undefined for a completed show without a date', () => {
    expect(getCompletionDate({ ...show, dateCompleted: undefined })).toBeUndefined()
  })

  it.each(['ongoing', 'dropped'] as const)('returns undefined for a %s show, even if it has a date', (status) => {
    expect(getCompletionDate({ ...show, status })).toBeUndefined()
  })
})
