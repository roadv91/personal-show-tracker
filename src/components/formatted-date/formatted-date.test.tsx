import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormattedDate } from './formatted-date'

describe('FormattedDate', () => {
  it('shows the date as "Mon D, YYYY" with the ISO date in dateTime', () => {
    render(<FormattedDate isoDate="2026-09-05" />)
    expect(screen.getByText('Sep 5, 2026')).toHaveAttribute('dateTime', '2026-09-05')
  })

  it('shows the same day for the first of a month, whatever the time zone', () => {
    render(<FormattedDate isoDate="2025-01-01" />)
    expect(screen.getByText('Jan 1, 2025')).toBeInTheDocument()
  })
})
