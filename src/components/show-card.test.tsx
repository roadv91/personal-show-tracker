import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Show } from '../types/show'
import { ShowCard } from './show-card'

const completedShow: Show = {
  id: '1',
  name: 'Succession',
  status: 'completed',
  rating: 4.9,
  dateCompleted: '2025-05-28',
  notes: 'Roman Roy is incredibly written.',
}

const ongoingShow: Show = { id: '2', name: 'Severance', status: 'ongoing', rating: 4.8 }

describe('ShowCard', () => {
  it('shows the name as a heading, with status, rating, date, and notes', () => {
    render(<ShowCard show={completedShow} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Succession' })).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('4.9', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('May 28, 2025')).toBeInTheDocument()
    expect(screen.getByText('“Roman Roy is incredibly written.”')).toBeInTheDocument()
  })

  it('leaves out the date and notes when the show has none', () => {
    render(<ShowCard show={ongoingShow} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/Completed:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/“/)).not.toBeInTheDocument()
  })

  it('leaves out the date when the show is not completed, even if it has one', () => {
    render(<ShowCard show={{ ...ongoingShow, dateCompleted: '2025-01-01' }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/Completed:/)).not.toBeInTheDocument()
  })

  it('calls onEdit and onDelete with the show', async () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()
    render(<ShowCard show={completedShow} onEdit={handleEdit} onDelete={handleDelete} />)

    await userEvent.click(screen.getByRole('button', { name: 'Edit Succession' }))
    expect(handleEdit).toHaveBeenCalledWith(completedShow)

    await userEvent.click(screen.getByRole('button', { name: 'Delete Succession' }))
    expect(handleDelete).toHaveBeenCalledWith(completedShow)
  })
})
