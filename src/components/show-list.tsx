import type { FC } from 'react'
import type { Show } from '../types/show'
import { ShowCard } from './show-card'
import { showTableCellClassName, ShowTableRow } from './show-table-row'

/** Props for {@link ShowList}. */
export interface ShowListProps {
  /** The shows to list, in display order. */
  shows: Show[]
  /** Called with a show when its edit button is clicked. */
  onEdit: (show: Show) => void
  /** Called with a show when its delete button is clicked. */
  onDelete: (show: Show) => void
}

/** Classes shared by every column header. */
const columnHeaderClassName = `${showTableCellClassName} text-xs font-semibold tracking-wide text-neutral-500 uppercase`

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

    <div className="hidden rounded-lg border border-neutral-200 bg-[#ffffff] shadow-sm tablet:block">
      <table className="w-full text-sm">
        <caption className="sr-only">Your shows</caption>
        <thead>
          <tr>
            <th scope="col" className={`${columnHeaderClassName} text-left`}>Name</th>
            <th scope="col" className={`${columnHeaderClassName} text-left`}>Status</th>
            <th scope="col" className={`${columnHeaderClassName} text-left`}>Date Completed</th>
            <th scope="col" className={`${columnHeaderClassName} text-left`}>Rating</th>
            <th scope="col" className={`${columnHeaderClassName} text-left`}>Notes</th>
            <th scope="col" className={`${columnHeaderClassName} text-right`}>Actions</th>
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
