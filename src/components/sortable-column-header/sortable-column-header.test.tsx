import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SortableColumnHeader } from './sortable-column-header'

/** Renders the header inside a table, as it's used in the app. */
const renderHeader = (direction?: 'ascending' | 'descending', onSort = vi.fn()) =>
  render(
    <table>
      <thead>
        <tr>
          <SortableColumnHeader label="Name" direction={direction} onSort={onSort} />
        </tr>
      </thead>
    </table>,
  )

describe('SortableColumnHeader', () => {
  it('has a button named after the column, and hides the icon from screen readers', () => {
    const { container } = renderHeader()
    expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it.each([undefined, 'ascending', 'descending'] as const)('sets aria-sort to match the direction (%s)', (direction) => {
    renderHeader(direction)
    const header = screen.getByRole('columnheader')
    if (direction) expect(header).toHaveAttribute('aria-sort', direction)
    else expect(header).not.toHaveAttribute('aria-sort')
  })

  it('calls onSort on click, Enter, and Space', async () => {
    const onSort = vi.fn()
    const user = userEvent.setup()
    renderHeader(undefined, onSort)
    await user.click(screen.getByRole('button'))
    await user.tab()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onSort).toHaveBeenCalledTimes(3)
  })
})
