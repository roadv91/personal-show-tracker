import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowRating } from './show-rating'

/**
 * Gets the text a sighted user sees, leaving out the screen-reader-only text.
 * @param element - The element to read.
 * @returns The element's text without any `.sr-only` content.
 */
const getVisibleText = (element: HTMLElement) => {
  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.sr-only').forEach((screenReaderOnlyElement) => screenReaderOnlyElement.remove())
  return clone.textContent
}

describe('ShowRating', () => {
  it.each([
    [5, '5.0'],
    [4.8, '4.8'],
    [0, '0.0'],
    [4.99, '4.9'],
    [4.96, '4.9'],
    [4.85, '4.8'],
    [0.29, '0.2'],
  ])('displays %s as "%s", truncated rather than rounded', (rating, displayedRating) => {
    const { container } = render(<ShowRating rating={rating} />)
    expect(getVisibleText(container)).toBe(displayedRating)
    expect(container.textContent).toBe(`Rating: ${displayedRating} out of 5`)
  })

  it('hides the star from screen readers', () => {
    const { container } = render(<ShowRating rating={4} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
