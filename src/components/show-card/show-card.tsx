import type { FC } from 'react'
import type { ShowItemProps } from '../../types/show'
import { getCompletionDate } from '../../utils/get-completion-date'
import { ShowActions } from '../show-actions/show-actions'
import { ShowRating } from '../show-rating/show-rating'
import { ShowStatusBadge } from '../show-status-badge/show-status-badge'

/**
 * Card showing one show, used in the mobile layout of {@link ShowList}.
 *
 * Shows the name (as a heading, so screen reader users can jump between shows), the status badge
 * (with the completion date, for completed shows that have one), the rating if there is one, edit
 * and delete buttons (vertically centered beside the details), and the notes if there are any.
 *
 * Below the `large-phone` breakpoint (390px) the spacing tightens and the rating stacks below the
 * status badge, leaving more room for the name.
 *
 * Long names and notes wrap at spaces, and break inside a word only when it can't fit on a line.
 * `wrap-anywhere` (not `break-words`) lets the heading shrink below its longest word, so a long
 * word can't push the edit and delete buttons out of the card.
 *
 * @param props - See {@link ShowItemProps}.
 * @returns The card element.
 */
export const ShowCard: FC<ShowItemProps> = ({ show, onEdit, onDelete }) => (
  <article className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm large-phone:gap-4">
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 pr-4 large-phone:gap-4">
        <h2 className="text-sm font-bold wrap-anywhere text-neutral-900">{show.name}</h2>
        <div className="flex flex-col items-start gap-2 large-phone:flex-row large-phone:flex-wrap large-phone:items-center">
          <ShowStatusBadge status={show.status} completionDate={getCompletionDate(show)} />
          {show.rating !== undefined && <ShowRating rating={show.rating} />}
        </div>
      </div>
      <ShowActions show={show} onEdit={onEdit} onDelete={onDelete} />
    </div>
    {show.notes && (
      <p className="border-t border-neutral-200 pt-2 text-xs wrap-anywhere text-neutral-600 italic">
        “{show.notes}”
      </p>
    )}
  </article>
)
