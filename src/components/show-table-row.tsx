import type { FC } from 'react'
import type { Show } from '../types/show'
import { getCompletionDate } from '../utils/get-completion-date'
import { FormattedDate } from './formatted-date'
import { ShowActions } from './show-actions'
import { ShowRating } from './show-rating'
import { ShowStatusBadge } from './show-status-badge'

/**
 * Padding for every cell of the shows table, header cells included. Tighter on tablets so the
 * six columns fit from the `tablet` breakpoint up without overflowing.
 */
export const showTableCellClassName = 'px-3 py-3 desktop:px-4'

/** Props for {@link ShowTableRow}. */
export interface ShowTableRowProps {
  /** The show to display. */
  show: Show
  /** Called with the show when its edit button is clicked. */
  onEdit: (show: Show) => void
  /** Called with the show when its delete button is clicked. */
  onDelete: (show: Show) => void
}

/**
 * Table row showing one show, used in the tablet and desktop layout of {@link ShowList}.
 * Must be rendered inside a `<tbody>`.
 *
 * The name cell is the row header, so screen readers announce the show name along with each cell.
 * The completion date only appears for completed shows that have one; otherwise the cell shows
 * a dash, which screen readers hear as "No completion date".
 *
 * @param props - See {@link ShowTableRowProps}.
 * @returns The `<tr>` element.
 */
export const ShowTableRow: FC<ShowTableRowProps> = ({ show, onEdit, onDelete }) => {
  const completionDate = getCompletionDate(show)

  return (
    <tr className="border-t border-neutral-200 align-middle">
      <th scope="row" className={`${showTableCellClassName} text-left font-semibold break-words text-neutral-900`}>
        {show.name}
      </th>
      <td className={showTableCellClassName}>
        <ShowStatusBadge status={show.status} />
      </td>
      <td className={`${showTableCellClassName} whitespace-nowrap text-neutral-600`}>
        {completionDate ? (
          <FormattedDate isoDate={completionDate} />
        ) : (
          <>
            <span aria-hidden="true">—</span>
            <span className="sr-only">No completion date</span>
          </>
        )}
      </td>
      <td className={showTableCellClassName}>
        <ShowRating rating={show.rating} />
      </td>
      <td className={`${showTableCellClassName} break-words text-neutral-600`}>{show.notes}</td>
      <td className={showTableCellClassName}>
        <div className="flex justify-end">
          <ShowActions showName={show.name} onEdit={() => onEdit(show)} onDelete={() => onDelete(show)} />
        </div>
      </td>
    </tr>
  )
}
