import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '../../test/render-with-store'
import type { Show } from '../../types/show'
import { ShowList } from './show-list'

const shows: Show[] = [
  { id: '1', name: 'Breaking Bad', status: 'completed', rating: 4.7, dateCompleted: '2024-08-12' },
  { id: '2', name: 'House of the Dragon', status: 'ongoing', rating: 4.1 },
]

/** Renders the list with the shows above in the store. */
const renderList = () => renderWithStore(<ShowList onEdit={vi.fn()} onDelete={vi.fn()} />, { shows })

/** The names of the shows in the table, in the order shown. */
const rowNames = () => within(screen.getByRole('table')).getAllByRole('rowheader').map((header) => header.textContent)

// jsdom doesn't apply Tailwind's CSS, so both layouts are visible to these queries
describe('ShowList', () => {
  it('renders a card per show in a list', () => {
    renderList()
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByRole('heading', { name: 'Breaking Bad' })).toBeInTheDocument()
  })

  it('renders a table with a header row and a row per show', () => {
    renderList()
    const table = screen.getByRole('table', { name: 'Your shows' })
    const columnNames = within(table).getAllByRole('columnheader').map((header) => header.textContent)
    expect(columnNames).toEqual(['Name', 'Status', 'Date Completed', 'Rating', 'Notes', 'Actions'])
    expect(within(table).getAllByRole('rowheader').map((header) => header.textContent)).toEqual([
      'Breaking Bad',
      'House of the Dragon',
    ])
  })

  it('sorts the shows by the sort method in the store, newest first by default', () => {
    renderList()
    expect(rowNames()).toEqual(['Breaking Bad', 'House of the Dragon'])
  })

  it('sorts the table by Name, Date Completed, and Rating, switching direction on each click', async () => {
    const user = userEvent.setup()
    renderWithStore(<ShowList onEdit={vi.fn()} onDelete={vi.fn()} />, {
      shows: [
        { id: '1', name: 'Beta', status: 'completed', rating: 2, dateCompleted: '2024-01-01' },
        { id: '2', name: 'Alpha', status: 'ongoing', rating: 5 },
        { id: '3', name: 'Gamma', status: 'completed', rating: 3, dateCompleted: '2025-01-01' },
      ],
    })
    const sortBy = (name: string) => user.click(screen.getByRole('button', { name }))

    expect(rowNames()).toEqual(['Gamma', 'Beta', 'Alpha'])

    await sortBy('Date Completed')
    expect(rowNames()).toEqual(['Beta', 'Gamma', 'Alpha'])
    await sortBy('Date Completed')
    expect(rowNames()).toEqual(['Gamma', 'Beta', 'Alpha'])

    await sortBy('Name')
    expect(rowNames()).toEqual(['Alpha', 'Beta', 'Gamma'])
    await sortBy('Name')
    expect(rowNames()).toEqual(['Gamma', 'Beta', 'Alpha'])

    await sortBy('Rating')
    expect(rowNames()).toEqual(['Beta', 'Gamma', 'Alpha'])
    await sortBy('Rating')
    expect(rowNames()).toEqual(['Alpha', 'Gamma', 'Beta'])
  })

  it('sets aria-sort only on the sorted column and shows its direction', async () => {
    const user = userEvent.setup()
    renderList()
    expect(screen.getByRole('columnheader', { name: 'Date Completed' })).toHaveAttribute('aria-sort', 'descending')
    expect(screen.getByRole('columnheader', { name: 'Name' })).not.toHaveAttribute('aria-sort')

    await user.click(screen.getByRole('button', { name: 'Name' }))
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByRole('columnheader', { name: 'Date Completed' })).not.toHaveAttribute('aria-sort')
  })

  it('does not reorder the stored shows, and saves the chosen sort', async () => {
    const user = userEvent.setup()
    const { store } = renderList()
    await user.click(screen.getByRole('button', { name: 'Name' }))
    expect(store.getState().shows.shows).toEqual(shows)
    expect(store.getState().shows.sortMethod).toBe('name-a-z')
  })

  // jsdom can't evaluate media queries, so these check the responsive classes rather than real visibility
  it('shows the cards and hides the table on mobile', () => {
    renderList()
    // Unprefixed classes apply on mobile
    expect(screen.getByRole('list')).not.toHaveClass('hidden')
    expect(screen.getByRole('table').parentElement).toHaveClass('hidden')
  })

  it('shows the table and hides the cards from the tablet breakpoint up', () => {
    renderList()
    expect(screen.getByRole('list')).toHaveClass('tablet:hidden')
    expect(screen.getByRole('table').parentElement).toHaveClass('tablet:block')
  })
})
