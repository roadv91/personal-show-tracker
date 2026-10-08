import type { FC } from 'react'
import type { ShowItemProps } from '../types/show'
import { getCompletionDate } from '../utils/get-completion-date'
import { FormattedDate } from './formatted-date'
import { Icon } from './icon/icon'
import { ShowActions } from './show-actions'
import { ShowRating } from './show-rating'
import { ShowStatusBadge } from './show-status-badge'

// TODO: Replace the hard-coded `#ffffff` background with a `color/white` primitive once it's added in Figma.
/**
 * Card showing one show, used in the mobile layout of {@link ShowList}.
 *
 * Shows the name (as a heading, so screen reader users can jump between shows), edit and delete
 * buttons, status, rating, the completion date (only for completed shows that have one), and the
 * notes if there are any. Long names and notes wrap at spaces, and break inside a word only when it
 * can't fit on a line. `wrap-anywhere` (not `break-words`) lets the heading shrink below its longest
 * word, so a long word can't push the edit and delete buttons out of the card.
 *
 * @param props - See {@link ShowItemProps}.
 * @returns The card element.
 */
export const ShowCard: FC<ShowItemProps> = ({ show, onEdit, onDelete }) => {
  const completionDate = getCompletionDate(show)

  return (
    <article className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-[#ffffff] p-4 pt-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        {/* pt-1.5 centers the title's first 20px line on the 32px buttons beside it */}
        <h2 className="pt-1.5 text-sm font-bold wrap-anywhere text-neutral-900">{show.name}</h2>
        <ShowActions show={show} onEdit={onEdit} onDelete={onDelete} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ShowStatusBadge status={show.status} />
        <ShowRating rating={show.rating} />
      </div>
      {completionDate && (
        <p className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
          <Icon name="Calendar" size={16} color="currentColor" />
          <span>
            Completed: <FormattedDate isoDate={completionDate} />
          </span>
        </p>
      )}
      {show.notes && (
        <p className="mt-1 border-t border-neutral-200 pt-3 text-xs wrap-anywhere text-neutral-600 italic">
          “{show.notes}”
        </p>
      )}
    </article>
  )
}
