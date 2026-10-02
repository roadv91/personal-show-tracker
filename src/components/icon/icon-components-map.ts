import type { FC } from 'react'
import { Edit } from './assets/edit'
import { Star } from './assets/star'
import { Trash } from './assets/trash'

/**
 * Maps each icon name to the component that renders its path data.
 * To add an icon, create its file in `assets/` and add it here; {@link IconName} updates automatically.
 */
export const iconComponentsMap = {
  Edit,
  Star,
  Trash,
} satisfies Record<string, FC>

/** Names of the icons {@link Icon} can render. */
export type IconName = keyof typeof iconComponentsMap
