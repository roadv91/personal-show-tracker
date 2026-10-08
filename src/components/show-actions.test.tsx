import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Show } from '../types/show'
import { ShowActions } from './show-actions'

const show: Show = { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 }

describe('ShowActions', () => {
  it('names the buttons after the show and calls the matching handler with it', async () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()
    render(<ShowActions show={show} onEdit={handleEdit} onDelete={handleDelete} />)

    await userEvent.click(screen.getByRole('button', { name: 'Edit Severance' }))
    expect(handleEdit).toHaveBeenCalledWith(show)
    expect(handleDelete).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Delete Severance' }))
    expect(handleDelete).toHaveBeenCalledWith(show)
  })

  it('shows the delete icon in red', () => {
    render(<ShowActions show={show} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const deleteButton = screen.getByRole('button', { name: 'Delete Severance' })
    expect(deleteButton.querySelector('svg')).toHaveAttribute('fill', 'var(--color-red-500)')
  })
})
