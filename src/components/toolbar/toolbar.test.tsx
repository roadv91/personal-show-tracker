import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toolbar } from './toolbar'

describe('Toolbar', () => {
  it('calls onFilter when Filter is clicked', async () => {
    const handleFilter = vi.fn()
    render(<Toolbar onFilter={handleFilter} />)
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    expect(handleFilter).toHaveBeenCalledOnce()
  })

  // jsdom can't evaluate media queries, so this checks the responsive class rather than real visibility
  it('hides the sort dropdown from the tablet breakpoint up', () => {
    render(<Toolbar onFilter={vi.fn()} />)
    const sortSelect = screen.getByRole('combobox', { name: 'Sort by' })
    expect(sortSelect.closest('.tablet\\:hidden')).toBeInTheDocument()
  })
})
