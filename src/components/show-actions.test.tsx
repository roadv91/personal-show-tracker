import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ShowActions } from './show-actions'

describe('ShowActions', () => {
  it('names the buttons after the show and calls the matching handler', async () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()
    render(<ShowActions showName="Severance" onEdit={handleEdit} onDelete={handleDelete} />)

    await userEvent.click(screen.getByRole('button', { name: 'Edit Severance' }))
    expect(handleEdit).toHaveBeenCalledOnce()
    expect(handleDelete).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Delete Severance' }))
    expect(handleDelete).toHaveBeenCalledOnce()
  })

  it('shows the delete icon in red', () => {
    render(<ShowActions showName="Severance" onEdit={vi.fn()} onDelete={vi.fn()} />)
    const deleteButton = screen.getByRole('button', { name: 'Delete Severance' })
    expect(deleteButton.querySelector('svg')).toHaveAttribute('fill', 'var(--color-red-500)')
  })
})
