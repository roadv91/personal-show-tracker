import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { IconButton } from './icon-button'

describe('IconButton', () => {
  it('is a button named by its label, with the icon hidden from screen readers', () => {
    render(<IconButton name="Trash" label="Delete show" />)
    const button = screen.getByRole('button', { name: 'Delete show' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<IconButton name="Edit" label="Edit show" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit show' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('can be activated with the keyboard', async () => {
    const handleClick = vi.fn()
    render(<IconButton name="Star" label="Favorite show" onClick={handleClick} />)
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Favorite show' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<IconButton name="Trash" label="Delete show" onClick={handleClick} disabled />)
    const button = screen.getByRole('button', { name: 'Delete show' })
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
