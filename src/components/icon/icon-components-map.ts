import type { FC } from 'react'
import { Calendar } from './assets/calendar'
import { ChevronDown } from './assets/chevron-down'
import { ChevronUp } from './assets/chevron-up'
import { Edit } from './assets/edit'
import { Filter } from './assets/filter'
import { Plus } from './assets/plus'
import { Sort } from './assets/sort'
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
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Plus,
  Sort,
  Star,
  StarFilled,
  Trash,
} satisfies Record<string, FC>

/** Names of the icons {@link Icon} can render. */
export type IconName = keyof typeof iconComponentsMap
