import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge, type BadgeType } from './badge'

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge type="ongoing" label="Currently Watching" />)
    expect(screen.getByText('Currently Watching')).toBeInTheDocument()
  })

  it.each<[BadgeType, string, string]>([
    ['ongoing', 'bg-badge-ongoing-surface', 'text-badge-ongoing-content'],
    ['completed', 'bg-badge-completed-surface', 'text-badge-completed-content'],
    ['dropped', 'bg-badge-dropped-surface', 'text-badge-dropped-content'],
  ])('applies the %s type colors', (type, backgroundClassName, textClassName) => {
    render(<Badge type={type} label="Label" />)
    expect(screen.getByText('Label')).toHaveClass(backgroundClassName, textClassName)
  })
})
