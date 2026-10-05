import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Show } from '../types/show'
import { ShowList } from './show-list'

const shows: Show[] = [
  { id: '1', name: 'Breaking Bad', status: 'completed', rating: 4.7, dateCompleted: '2024-08-12' },
  { id: '2', name: 'House of the Dragon', status: 'ongoing', rating: 4.1 },
]

// jsdom doesn't apply Tailwind's CSS, so both layouts are visible to these queries
describe('ShowList', () => {
  it('renders a card per show in a list', () => {
    render(<ShowList shows={shows} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByRole('heading', { name: 'Breaking Bad' })).toBeInTheDocument()
  })

  it('renders a table with a header row and a row per show', () => {
    render(<ShowList shows={shows} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const table = screen.getByRole('table', { name: 'Your shows' })
    const columnNames = within(table).getAllByRole('columnheader').map((header) => header.textContent)
    expect(columnNames).toEqual(['Name', 'Status', 'Date Completed', 'Rating', 'Notes', 'Actions'])
    expect(within(table).getAllByRole('rowheader').map((header) => header.textContent)).toEqual([
      'Breaking Bad',
      'House of the Dragon',
    ])
  })

  // jsdom can't evaluate media queries, so these check the responsive classes rather than real visibility
  it('shows the cards and hides the table on mobile', () => {
    render(<ShowList shows={shows} onEdit={vi.fn()} onDelete={vi.fn()} />)
    // Unprefixed classes apply on mobile
    expect(screen.getByRole('list')).not.toHaveClass('hidden')
    expect(screen.getByRole('table').parentElement).toHaveClass('hidden')
  })

  it('shows the table and hides the cards from the tablet breakpoint up', () => {
    render(<ShowList shows={shows} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('list')).toHaveClass('tablet:hidden')
    expect(screen.getByRole('table').parentElement).toHaveClass('tablet:block')
  })
})
