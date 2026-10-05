import type { FC } from 'react'
import type { ShowStatus } from '../types/show'
import { Badge } from './badge'

/** Label shown for each status. */
const statusLabels: Record<ShowStatus, string> = {
  ongoing: 'Currently Watching',
  completed: 'Completed',
  dropped: 'Dropped',
}

/** Props for {@link ShowStatusBadge}. */
export interface ShowStatusBadgeProps {
  /** The show's status. */
  status: ShowStatus
}

/**
 * Badge showing a show's status, e.g. "Currently Watching".
 *
 * @param props - See {@link ShowStatusBadgeProps}.
 * @returns The badge element.
 */
export const ShowStatusBadge: FC<ShowStatusBadgeProps> = ({ status }) => (
  <Badge type={status} label={statusLabels[status]} />
)
