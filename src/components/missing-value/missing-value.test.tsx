import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MissingValue } from './missing-value'

describe('MissingValue', () => {
  it('shows a dash hidden from screen readers, which announce the label instead', () => {
    render(<MissingValue label="No rating" />)
    expect(screen.getByText('—')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('No rating')).toHaveClass('sr-only')
  })
})
