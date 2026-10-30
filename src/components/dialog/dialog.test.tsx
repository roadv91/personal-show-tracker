import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Dialog } from './dialog'

describe('Dialog', () => {
  it('is hidden and empty while closed', () => {
    render(
      <Dialog open={false} onClose={vi.fn()} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('opens as a dialog named by its title, with the content', () => {
    render(
      <Dialog open onClose={vi.fn()} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    expect(screen.getByRole('dialog', { name: 'Add show' })).toHaveAttribute('open')
    expect(screen.getByRole('heading', { name: 'Add show' })).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('closes when open becomes false', () => {
    const { rerender } = render(
      <Dialog open onClose={vi.fn()} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    rerender(
      <Dialog open={false} onClose={vi.fn()} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose from the close button', async () => {
    const handleClose = vi.fn()
    render(
      <Dialog open onClose={handleClose} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Esc instead of closing itself', () => {
    const handleClose = vi.fn()
    render(
      <Dialog open onClose={handleClose} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog')
    // Browsers fire `cancel` on the dialog when Esc is pressed
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(handleClose).toHaveBeenCalledOnce()
    expect(dialog).toHaveAttribute('open')
  })

  it('calls onClose on a backdrop click, but not on a click inside', async () => {
    const handleClose = vi.fn()
    render(
      <Dialog open onClose={handleClose} title="Add show" placement="center">
        <p>Content</p>
      </Dialog>,
    )
    await userEvent.click(screen.getByText('Content'))
    expect(handleClose).not.toHaveBeenCalled()

    // The dialog element itself is only reachable through the backdrop
    await userEvent.click(screen.getByRole('dialog'))
    expect(handleClose).toHaveBeenCalledOnce()
  })
})
