import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Show } from '../types/show'
import { ShowTableRow, type ShowTableRowProps } from './show-table-row'

const completedShow: Show = {
  id: '1',
  name: 'Ted Lasso',
  status: 'completed',
  rating: 4.3,
  dateCompleted: '2025-10-15',
  notes: 'Pure wholesome comfort food.',
}

const droppedShow: Show = { id: '2', name: 'The Witcher', status: 'dropped', rating: 2.5 }

/** Renders the row inside the table elements it needs to be valid HTML. */
const renderRow = (props: ShowTableRowProps) =>
  render(
    <table>
      <tbody>
        <ShowTableRow {...props} />
      </tbody>
    </table>,
  )

describe('ShowTableRow', () => {
  it('shows the name as the row header, with status, date, rating, and notes', () => {
    renderRow({ show: completedShow, onEdit: vi.fn(), onDelete: vi.fn() })
    expect(screen.getByRole('rowheader', { name: 'Ted Lasso' })).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Oct 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('4.3', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Pure wholesome comfort food.')).toBeInTheDocument()
  })

  it.each<[string, Show]>([
    ['a completed show without a date', { ...completedShow, dateCompleted: undefined }],
    ['a show that is not completed, even if it has a date', { ...droppedShow, dateCompleted: '2025-01-01' }],
  ])('shows a dash, announced as "No completion date", for %s', (_description, show) => {
    const { container } = renderRow({ show, onEdit: vi.fn(), onDelete: vi.fn() })
    expect(screen.getByText('—')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('No completion date')).toBeInTheDocument()
    expect(container.querySelector('time')).not.toBeInTheDocument()
  })

  it('calls onEdit and onDelete with the show', async () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()
    renderRow({ show: completedShow, onEdit: handleEdit, onDelete: handleDelete })

    await userEvent.click(screen.getByRole('button', { name: 'Edit Ted Lasso' }))
    expect(handleEdit).toHaveBeenCalledWith(completedShow)

    await userEvent.click(screen.getByRole('button', { name: 'Delete Ted Lasso' }))
    expect(handleDelete).toHaveBeenCalledWith(completedShow)
  })
})
