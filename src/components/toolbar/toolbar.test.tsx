import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '../../test/render-with-store'
import { Toolbar } from './toolbar'

// The sort dropdown reads from the Redux store, so the toolbar is rendered with one
describe('Toolbar', () => {
  it('calls onFilter when Filter is clicked', async () => {
    const handleFilter = vi.fn()
    renderWithStore(<Toolbar onFilter={handleFilter} />)
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    expect(handleFilter).toHaveBeenCalledOnce()
  })

  // jsdom can't evaluate media queries, so this checks the responsive class rather than real visibility
  it('hides the sort dropdown from the tablet breakpoint up', () => {
    renderWithStore(<Toolbar onFilter={vi.fn()} />)
    const sortSelect = screen.getByRole('combobox', { name: 'Sort by' })
    expect(sortSelect.closest('.tablet\\:hidden')).toBeInTheDocument()
  })
})
