import type { FC } from 'react'
import type { Show, ShowActionHandlers } from '../types/show'
import { ShowCard } from './show-card'
import { showTableCellClassName, ShowTableRow } from './show-table-row'

/** Props for {@link ShowList}. */
export interface ShowListProps extends ShowActionHandlers {
  /** The shows to list, in display order. */
  shows: Show[]
}

/** Classes shared by every column header. */
const columnHeaderClassName = `${showTableCellClassName} text-xs font-semibold tracking-wide text-neutral-600 uppercase`

/** The table's columns, in order. Only Actions is right-aligned, to sit above its buttons. */
const columns = [
  { label: 'Name', alignClassName: 'text-left' },
  { label: 'Status', alignClassName: 'text-left' },
  { label: 'Date Completed', alignClassName: 'text-left' },
  { label: 'Rating', alignClassName: 'text-left' },
  { label: 'Notes', alignClassName: 'text-left' },
  { label: 'Actions', alignClassName: 'text-right' },
]

// TODO: Replace the hard-coded `#ffffff` background with a `color/white` primitive once it's added in Figma.
/**
 * Lists the user's shows: as cards on mobile, and as a table from the `tablet` breakpoint up.
 *
 * Both layouts are rendered and CSS hides one. Hidden content (`display: none`) is also hidden
 * from screen readers, so each show is only announced once.
 *
 * @param props - See {@link ShowListProps}.
 * @returns The card list and the table.
 */
export const ShowList: FC<ShowListProps> = ({ shows, onEdit, onDelete }) => (
  <>
    {/* role="list" restores list semantics, which Safari drops when list-style is removed */}
    <ul role="list" className="flex flex-col gap-3 tablet:hidden">
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>

    {/* overflow-hidden clips the header row's background to the rounded corners */}
    <div className="hidden overflow-hidden rounded-lg border border-neutral-200 bg-[#ffffff] shadow-sm tablet:block">
      <table className="w-full text-sm">
        <caption className="sr-only">Your shows</caption>
        <thead>
          <tr className="bg-neutral-200">
            {columns.map((column) => (
              <th key={column.label} scope="col" className={`${columnHeaderClassName} ${column.alignClassName}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <ShowTableRow key={show.id} show={show} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  </>
)
