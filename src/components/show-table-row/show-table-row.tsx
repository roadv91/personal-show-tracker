import type { FC } from 'react'
import type { ShowItemProps } from '../../types/show'
import { getCompletionDate } from '../../utils/get-completion-date'
import { FormattedDate } from '../formatted-date/formatted-date'
import { MissingValue } from '../missing-value/missing-value'
import { ShowActions } from '../show-actions/show-actions'
import { ShowRating } from '../show-rating/show-rating'
import { ShowStatusBadge } from '../show-status-badge/show-status-badge'

/**
 * Side padding for every cell of the shows table, header cells included. Tighter on tablets so the
 * six columns fit from the `tablet` breakpoint up without overflowing.
 */
export const showTableCellSidePaddingClassName = 'px-3 desktop:px-4'

/** Padding for the body cells of the shows table. */
const showTableCellClassName = `${showTableCellSidePaddingClassName} py-3`

/**
 * Table row showing one show, used in the tablet and desktop layout of {@link ShowList}.
 * Must be rendered inside a `<tbody>`.
 *
 * The name cell is the row header, so screen readers announce the show name along with each cell.
 * The completion date only appears for completed shows that have one; otherwise the cell shows
 * a dash, which screen readers hear as "No completion date".
 *
 * The name and notes wrap at spaces, and break inside a word only when it can't fit on a line.
 * They use `wrap-anywhere` rather than `break-words` because in a table, only `anywhere` lets the
 * column shrink below its longest word, so a long URL can't push the table wider than the screen.
 *
 * @param props - See {@link ShowItemProps}.
 * @returns The `<tr>` element.
 */
export const ShowTableRow: FC<ShowItemProps> = ({ show, onEdit, onDelete }) => {
  const completionDate = getCompletionDate(show)

  return (
    <tr className="border-t border-neutral-200 align-middle">
      <th scope="row" className={`${showTableCellClassName} text-left font-semibold wrap-anywhere text-neutral-900`}>
        {show.name}
      </th>
      <td className={showTableCellClassName}>
        <ShowStatusBadge status={show.status} />
      </td>
      <td className={`${showTableCellClassName} whitespace-nowrap text-neutral-600`}>
        {completionDate ? <FormattedDate isoDate={completionDate} /> : <MissingValue label="No completion date" />}
      </td>
      <td className={`${showTableCellClassName} text-neutral-600`}>
        {show.rating === undefined ? <MissingValue label="No rating" /> : <ShowRating rating={show.rating} />}
      </td>
      <td className={`${showTableCellClassName} wrap-anywhere text-neutral-600 italic`}>
        {show.notes && `“${show.notes}”`}
      </td>
      <td className={showTableCellClassName}>
        <div className="flex justify-end">
          <ShowActions show={show} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </td>
    </tr>
  )
}
