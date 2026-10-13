import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Header } from './header'

describe('Header', () => {
  it('is the page banner and calls onAddShow when Add show is clicked', async () => {
    const handleAddShow = vi.fn()
    render(<Header onAddShow={handleAddShow} />)
    expect(screen.getByRole('banner')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Add show' }))
    expect(handleAddShow).toHaveBeenCalledOnce()
  })
})
