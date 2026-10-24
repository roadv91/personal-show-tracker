import type { FC } from 'react'
import type { ShowStatus } from '../../types/show'
import { Badge } from '../badge/badge'
import { FormattedDate } from '../formatted-date/formatted-date'

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
  /**
   * When the show was completed, as an ISO date (`YYYY-MM-DD`). If given, the badge reads e.g.
   * "Completed: Sep 5, 2026". Leave it out where the date is shown elsewhere, like the table's
   * Date Completed column.
   */
  completionDate?: string
}

/**
 * Badge showing a show's status, e.g. "Currently Watching", optionally with its completion date.
 *
 * With a date, the status is semibold and the date regular weight. On very narrow screens the
 * date wraps onto a second line inside the badge instead of overflowing it.
 *
 * @param props - See {@link ShowStatusBadgeProps}.
 * @returns The badge element.
 */
export const ShowStatusBadge: FC<ShowStatusBadgeProps> = ({ status, completionDate }) => (
  <Badge
    type={status}
    label={
      completionDate ? (
        <>
          {/* The trailing space keeps screen readers from reading "Completed:Sep 5" as one word */}
          <span>{statusLabels[status]}: </span>
          <span className="font-normal">
            <FormattedDate isoDate={completionDate} />
          </span>
        </>
      ) : (
        statusLabels[status]
      )
    }
  />
)
