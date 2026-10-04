import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowRating } from './show-rating'

describe('ShowRating', () => {
  it.each([
    [5, '5.0'],
    [4.8, '4.8'],
    [0, '0.0'],
  ])('shows %s as %s with screen reader context', (rating, shownRating) => {
    render(<ShowRating rating={rating} />)
    expect(screen.getByText(shownRating, { exact: false })).toHaveTextContent(`Rating: ${shownRating} out of 5`)
  })

  it('hides the star from screen readers', () => {
    const { container } = render(<ShowRating rating={4} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
