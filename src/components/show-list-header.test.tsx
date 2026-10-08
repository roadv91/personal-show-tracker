import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ShowListHeader } from './show-list-header'

// jsdom doesn't apply Tailwind's CSS, so both Filter buttons (one per layout) are present here
describe('ShowListHeader', () => {
  it('shows the heading and the show count', () => {
    render(<ShowListHeader showCount={7} onFilter={vi.fn()} onAddShow={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1, name: 'My Shows' })).toBeInTheDocument()
    expect(screen.getByText('7 shows')).toBeInTheDocument()
  })

  it('uses the singular for one show', () => {
    render(<ShowListHeader showCount={1} onFilter={vi.fn()} onAddShow={vi.fn()} />)
    expect(screen.getByText('1 show')).toBeInTheDocument()
  })

  it('calls onAddShow and onFilter when their buttons are clicked', async () => {
    const handleFilter = vi.fn()
    const handleAddShow = vi.fn()
    render(<ShowListHeader showCount={7} onFilter={handleFilter} onAddShow={handleAddShow} />)

    await userEvent.click(screen.getByRole('button', { name: 'Add show' }))
    expect(handleAddShow).toHaveBeenCalledOnce()

    for (const filterButton of screen.getAllByRole('button', { name: 'Filter' })) {
      await userEvent.click(filterButton)
    }
    expect(handleFilter).toHaveBeenCalledTimes(2)
  })

  it('shows the sort dropdown and its Filter button only on mobile, and the other Filter button from tablet up', () => {
    render(<ShowListHeader showCount={7} onFilter={vi.fn()} onAddShow={vi.fn()} />)
    expect(screen.getByRole('combobox', { name: 'Sort by' }).parentElement?.parentElement).toHaveClass('tablet:hidden')
    const [desktopFilterButton] = screen.getAllByRole('button', { name: 'Filter' })
    expect(desktopFilterButton.parentElement).toHaveClass('hidden', 'tablet:block')
  })
})
