import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowSortSelect } from './show-sort-select'

describe('ShowSortSelect', () => {
  it('is labeled "Sort by" and starts on newest first', () => {
    render(<ShowSortSelect />)
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveDisplayValue('Date: newest first')
  })

  it('offers each sort order', () => {
    render(<ShowSortSelect />)
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Date: newest first',
      'Date: oldest first',
      'Rating: highest first',
      'Rating: lowest first',
      'Name: A–Z',
      'Name: Z–A',
    ])
  })

  it('hides the icons from screen readers', () => {
    const { container } = render(<ShowSortSelect />)
    container.querySelectorAll('svg').forEach((svg) => expect(svg).toHaveAttribute('aria-hidden', 'true'))
  })
})
