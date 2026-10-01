import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge, type BadgeType } from './badge'

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge type="ongoing" label="Currently Watching" />)
    expect(screen.getByText('Currently Watching')).toBeInTheDocument()
  })

  it.each<[BadgeType, string, string]>([
    ['ongoing', 'bg-badge-ongoing-bg', 'text-badge-ongoing-text'],
    ['completed', 'bg-badge-completed-bg', 'text-badge-completed-text'],
    ['dropped', 'bg-badge-dropped-bg', 'text-badge-dropped-text'],
  ])('applies the %s type colors', (type, backgroundClassName, textClassName) => {
    render(<Badge type={type} label="Label" />)
    expect(screen.getByText('Label')).toHaveClass(backgroundClassName, textClassName)
  })
})
