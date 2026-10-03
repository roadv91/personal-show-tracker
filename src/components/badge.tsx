import type { FC } from 'react'

/** Types of badge, matching the `badge/<type>` design tokens. */
export type BadgeType = 'ongoing' | 'completed' | 'dropped'

// TODO: Rename the Figma tokens so their names don't start or end with `bg`/`text` (avoids classes like `bg-badge-ongoing-bg`).
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
  /** Text shown inside the badge. */
  label: string
}

/**
 * Small pill-shaped label, e.g. for showing a show's watch status.
 *
 * The width hugs the label and the label never wraps.
 *
 * @param props - See {@link BadgeProps}.
 * @returns The badge element.
 */
export const Badge: FC<BadgeProps> = ({ type, label }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${typeClassNames[type]}`}
  >
    {label}
  </span>
)
