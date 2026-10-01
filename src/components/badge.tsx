import type { ReactNode } from 'react'

/** Types of badge, matching the `badge/<type>` design tokens. */
export type BadgeType = 'ongoing' | 'completed' | 'dropped'

/** Tailwind classes for each type. Written out in full so Tailwind can detect them. */
const typeClassNames: Record<BadgeType, string> = {
  ongoing: 'bg-badge-ongoing-bg text-badge-ongoing-text',
  completed: 'bg-badge-completed-bg text-badge-completed-text',
  dropped: 'bg-badge-dropped-bg text-badge-dropped-text',
}

/** Props for {@link Badge}. */
export interface BadgeProps {
  /** Type of the badge, which sets its colors. */
  type: BadgeType
  /** Label shown inside the badge. */
  children: ReactNode
}

/**
 * Small pill-shaped label, e.g. for showing a show's watch status.
 *
 * The width hugs the label and the label never wraps.
 *
 * @param props - See {@link BadgeProps}.
 * @returns The badge element.
 */
export function Badge({ type, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${typeClassNames[type]}`}
    >
      {children}
    </span>
  )
}
