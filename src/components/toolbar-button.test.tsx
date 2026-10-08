import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ToolbarButton } from './toolbar-button'

describe('ToolbarButton', () => {
  it('is a button named by its label, with the icon hidden from screen readers', () => {
    render(<ToolbarButton label="Add show" icon="Plus" variant="primary" />)
    const button = screen.getByRole('button', { name: 'Add show' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it.each([
    ['primary', 'bg-neutral-900'],
    ['secondary', 'border-neutral-300'],
  ] as const)('applies the %s variant styles', (variant, className) => {
    render(<ToolbarButton label="Label" icon="Filter" variant={variant} />)
    expect(screen.getByRole('button', { name: 'Label' })).toHaveClass(className)
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<ToolbarButton label="Filter" icon="Filter" variant="secondary" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('passes other button attributes through', () => {
    render(<ToolbarButton label="Filter" icon="Filter" variant="secondary" aria-expanded={false} />)
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute('aria-expanded', 'false')
  })
})
