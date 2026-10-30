import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Show } from '../../types/show'
import { AddUpdateShow } from './add-update-show'

const show: Show = { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 }

describe('AddUpdateShow', () => {
  it('opens an "Add show" sheet with the add form in add mode', () => {
    render(<AddUpdateShow mode="add" open onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Add show' })).toHaveTextContent('The add show form will go here.')
  })

  it('opens an "Edit show" sheet with the edit form for the given show in edit mode', () => {
    render(<AddUpdateShow mode="edit" show={show} open onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Edit show' })).toHaveTextContent(
      'The edit form for Severance will go here.',
    )
  })

  it('stays closed until open, and calls onClose from the close button', async () => {
    const handleClose = vi.fn()
    const { rerender } = render(<AddUpdateShow mode="add" open={false} onClose={handleClose} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<AddUpdateShow mode="add" open onClose={handleClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(handleClose).toHaveBeenCalledOnce()
  })
})
