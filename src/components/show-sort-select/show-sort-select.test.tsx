import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '../../test/render-with-store'
import { sortOptions } from '../../utils/sort-options'
import { ShowList } from '../show-list/show-list'
import { ShowSortSelect } from './show-sort-select'

describe('ShowSortSelect', () => {
  it('is labeled "Sort by" and starts on newest first when nothing is saved', () => {
    renderWithStore(<ShowSortSelect />)
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveDisplayValue('Date: newest first')
  })

  it('shows the sort method in the store', () => {
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

  it.each(sortOptions)('dispatches $value when "$label" is chosen', async ({ value, label }) => {
    const user = userEvent.setup()
    const { store } = renderWithStore(<ShowSortSelect />, { sortMethod: value === 'name-a-z' ? 'name-z-a' : 'name-a-z' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), label)
    expect(store.getState().shows.sortMethod).toBe(value)
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveDisplayValue(label)
  })

  it('sorts the cards by each option', async () => {
    const user = userEvent.setup()
    renderWithStore(
      <>
        <ShowSortSelect />
        <ShowList onEdit={vi.fn()} onDelete={vi.fn()} />
      </>,
      {
        shows: [
          { id: '1', name: 'Beta', status: 'completed', rating: 2, dateCompleted: '2024-01-01' },
          { id: '2', name: 'Alpha', status: 'ongoing', rating: 5 },
          { id: '3', name: 'Gamma', status: 'completed', rating: 3, dateCompleted: '2025-01-01' },
        ],
      },
    )
    const cardNames = () =>
      within(screen.getByRole('list')).getAllByRole('heading').map((heading) => heading.textContent)
    const select = screen.getByRole('combobox', { name: 'Sort by' })
    const expected = {
      'Date: newest first': ['Gamma', 'Beta', 'Alpha'],
      'Date: oldest first': ['Beta', 'Gamma', 'Alpha'],
      'Rating: highest first': ['Alpha', 'Gamma', 'Beta'],
      'Rating: lowest first': ['Beta', 'Gamma', 'Alpha'],
      'Name: A–Z': ['Alpha', 'Beta', 'Gamma'],
      'Name: Z–A': ['Gamma', 'Beta', 'Alpha'],
    }
    for (const [label, names] of Object.entries(expected)) {
      await user.selectOptions(select, label)
      expect(cardNames()).toEqual(names)
    }
  })

  it('hides the icons from screen readers', () => {
    const { container } = renderWithStore(<ShowSortSelect />)
    container.querySelectorAll('svg').forEach((svg) => expect(svg).toHaveAttribute('aria-hidden', 'true'))
  })
})
