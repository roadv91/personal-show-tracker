import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '../../test/render-with-store'
import { ShowSortSelect } from './show-sort-select'

describe('ShowSortSelect', () => {
  it('is labeled "Sort by" and starts on newest first when nothing is saved', () => {
    renderWithStore(<ShowSortSelect />)
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveDisplayValue('Date: newest first')
  })

  it('starts on the sort method in the store', () => {
    renderWithStore(<ShowSortSelect />, { sortMethod: 'rating-highest' })
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveDisplayValue('Rating: highest first')
  })

  it('offers each sort order', () => {
    renderWithStore(<ShowSortSelect />)
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
    const { container } = renderWithStore(<ShowSortSelect />)
    container.querySelectorAll('svg').forEach((svg) => expect(svg).toHaveAttribute('aria-hidden', 'true'))
  })
})
