import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon } from './icon'
import { iconComponentsMap, type IconName } from './icon-components-map'

describe('Icon', () => {
  it.each(Object.keys(iconComponentsMap) as IconName[])('renders the %s icon', (name) => {
    const { container } = render(<Icon name={name} />)
    expect(container.querySelector('svg path')).toBeInTheDocument()
  })

  it('is 24px by default and uses the given size', () => {
    const { container, rerender } = render(<Icon name="Star" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')

    rerender(<Icon name="Star" size={16} />)
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })

  it('inherits the text color by default and uses the given color', () => {
    const { container, rerender } = render(<Icon name="Edit" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'currentColor')

    rerender(<Icon name="Edit" color="var(--color-badge-ongoing-text)" />)
    expect(svg).toHaveAttribute('fill', 'var(--color-badge-ongoing-text)')
  })

  it('is hidden from screen readers when it has no label', () => {
    const { container } = render(<Icon name="Star" />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('is exposed as an image with its label as the accessible name', () => {
    render(<Icon name="Trash" label="Delete show" />)
    const svg = screen.getByRole('img', { name: 'Delete show' })
    expect(svg).not.toHaveAttribute('aria-hidden')
  })
})
