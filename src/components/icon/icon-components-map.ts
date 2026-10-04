import type { FC } from 'react'
import { Calendar } from './assets/calendar'
import { Edit } from './assets/edit'
import { Star } from './assets/star'
import { StarFilled } from './assets/star-filled'
import { Trash } from './assets/trash'

/**
 * Maps each icon name to the component that renders its path data.
 * To add an icon, create its file in `assets/` and add it here; {@link IconName} updates automatically.
 * Icons come from Unicons by IconScout (credited in the README).
 */
export const iconComponentsMap = {
  Calendar,
  Edit,
  Star,
  StarFilled,
  Trash,
} satisfies Record<string, FC>

/** Names of the icons {@link Icon} can render. */
export type IconName = keyof typeof iconComponentsMap
