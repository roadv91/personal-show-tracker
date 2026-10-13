import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Title } from './title'

describe('Title', () => {
  it('shows the title as the main heading with the description under it', () => {
    render(<Title title="My Shows" description="7 shows" />)
    expect(screen.getByRole('heading', { level: 1, name: 'My Shows' })).toBeInTheDocument()
    expect(screen.getByText('7 shows')).toHaveAttribute('aria-live', 'polite')
  })
})
