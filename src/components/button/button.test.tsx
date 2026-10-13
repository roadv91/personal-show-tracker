import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('is a button named by its label, with the icon hidden from screen readers', () => {
    render(<Button label="Add show" iconLeft="Plus" variant="primary" />)
    const button = screen.getByRole('button', { name: 'Add show' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses tighter left padding with an icon, and equal padding without one', () => {
    const { rerender } = render(<Button label="Filter" iconLeft="Filter" variant="secondary" />)
    const button = screen.getByRole('button', { name: 'Filter' })
    expect(button).toHaveClass('pl-2.5', 'pr-3')

    rerender(<Button label="Filter" variant="secondary" />)
    expect(button).toHaveClass('px-3')
    expect(button).not.toHaveClass('pl-2.5')
    expect(button.querySelector('svg')).not.toBeInTheDocument()
  })

  it.each([
    ['primary', 'bg-neutral-900'],
    ['secondary', 'border-neutral-300'],
  ] as const)('applies the %s variant styles', (variant, className) => {
    render(<Button label="Label" variant={variant} />)
    expect(screen.getByRole('button', { name: 'Label' })).toHaveClass(className)
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button label="Filter" variant="secondary" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('passes other button attributes through, including a different type', () => {
    render(<Button label="Save" variant="primary" type="submit" aria-expanded={false} />)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
