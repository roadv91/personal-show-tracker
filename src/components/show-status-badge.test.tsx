import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ShowStatus } from '../types/show'
import { ShowStatusBadge } from './show-status-badge'

describe('ShowStatusBadge', () => {
  it.each<[ShowStatus, string, string]>([
    ['ongoing', 'Currently Watching', 'bg-badge-ongoing-surface'],
    ['completed', 'Completed', 'bg-badge-completed-surface'],
    ['dropped', 'Dropped', 'bg-badge-dropped-surface'],
  ])('shows the %s status as "%s"', (status, label, className) => {
    render(<ShowStatusBadge status={status} />)
    expect(screen.getByText(label)).toHaveClass(className)
  })
})
