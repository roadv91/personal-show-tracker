import type { FC } from 'react'
import type { Show } from '../types/show'
import { getCompletionDate } from '../utils/get-completion-date'
import { FormattedDate } from './formatted-date'
import { Icon } from './icon/icon'
import { ShowActions } from './show-actions'
import { ShowRating } from './show-rating'
import { ShowStatusBadge } from './show-status-badge'

/** Props for {@link ShowCard}. */
export interface ShowCardProps {
  /** The show to display. */
  show: Show
  /** Called with the show when its edit button is clicked. */
  onEdit: (show: Show) => void
  /** Called with the show when its delete button is clicked. */
  onDelete: (show: Show) => void
}

// TODO: Replace the hard-coded `#ffffff` background with a `color/white` primitive once it's added in Figma.
/**
 * Card showing one show, used in the mobile layout of {@link ShowList}.
 *
 * Shows the name (as a heading, so screen reader users can jump between shows), edit and delete
 * buttons, status, rating, the completion date (only for completed shows that have one), and the
 * notes if there are any. Long names and notes wrap.
 *
 * @param props - See {@link ShowCardProps}.
 * @returns The card element.
 */
export const ShowCard: FC<ShowCardProps> = ({ show, onEdit, onDelete }) => {
  const completionDate = getCompletionDate(show)

  return (
    <article className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-[#ffffff] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-bold break-words text-neutral-900">{show.name}</h2>
        <ShowActions showName={show.name} onEdit={() => onEdit(show)} onDelete={() => onDelete(show)} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ShowStatusBadge status={show.status} />
        <ShowRating rating={show.rating} />
      </div>
      {completionDate && (
        <p className="flex items-center gap-1 text-sm text-neutral-600">
          <Icon name="Calendar" size={16} color="currentColor" />
          <span>
            Completed: <FormattedDate isoDate={completionDate} />
          </span>
        </p>
      )}
      {show.notes && (
        <p className="mt-1 border-t border-neutral-200 pt-3 text-sm break-words text-neutral-600 italic">
          “{show.notes}”
        </p>
      )}
    </article>
  )
}
