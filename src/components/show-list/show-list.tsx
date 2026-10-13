import type { FC } from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectShows } from '../../store/shows-slice'
import type { ShowActionHandlers } from '../../types/show'
import { ShowCard } from '../show-card/show-card'
import { showTableCellClassName, ShowTableRow } from '../show-table-row/show-table-row'

/** Classes shared by every column header. */
const columnHeaderClassName = `${showTableCellClassName} text-xs font-semibold tracking-wide text-neutral-600 uppercase`

// TODO: Replace the hard-coded `#ffffff` background with a `color/white` primitive once it's added in Figma.
/**
 * Lists the user's shows from the Redux store: as cards on mobile, and as a table from the
 * `tablet` breakpoint up. Must be rendered inside the Redux `Provider`.
 *
 * Both layouts are rendered and CSS hides one. Hidden content (`display: none`) is also hidden
 * from screen readers, so each show is only announced once.
 *
 * @param props - See {@link ShowActionHandlers}.
 * @returns The card list and the table.
 */
export const ShowList: FC<ShowActionHandlers> = ({ onEdit, onDelete }) => {
  const shows = useAppSelector(selectShows)

  return (
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
}
