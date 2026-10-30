import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BottomSheet } from '../bottom-sheet/bottom-sheet'
import { Modal } from '../modal/modal'
import { ResponsiveSheet } from './responsive-sheet'

// Modal and BottomSheet are tested here too: all three only pick a placement for Dialog
describe.each([
  ['Modal', Modal, ['m-auto', 'rounded-2xl']],
  ['BottomSheet', BottomSheet, ['mt-auto', 'rounded-t-2xl']],
  ['ResponsiveSheet', ResponsiveSheet, ['mt-auto', 'rounded-t-2xl', 'tablet:m-auto', 'tablet:rounded-2xl']],
] as const)('%s', (_name, Sheet, placementClassNames) => {
  it('opens as a dialog named by its title, placed by its classes', () => {
    render(
      <Sheet open onClose={vi.fn()} title="Add show">
        <p>Content</p>
      </Sheet>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Add show' })
    expect(dialog).toHaveClass(...placementClassNames)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
