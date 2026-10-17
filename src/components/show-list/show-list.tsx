import type { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectSortedShows, selectSortMethod, setSortMethod } from '../../store/shows-slice'
import type { ShowActionHandlers } from '../../types/show'
import { getNextSortOption, getSortState, type SortColumn } from '../../utils/sort-shows'
import { ShowCard } from '../show-card/show-card'
import { showTableCellClassName, ShowTableRow } from '../show-table-row/show-table-row'
import { SortableColumnHeader } from '../sortable-column-header/sortable-column-header'

/** Classes shared by every column header. */
const columnHeaderClassName = `${showTableCellClassName} text-xs font-semibold tracking-wide text-neutral-600 uppercase`

// TODO: Replace the hard-coded `#ffffff` background with a `color/white` primitive once it's added in Figma.
/**
 * Lists the user's shows from the Redux store: as cards on mobile, and as a table from the
 * `tablet` breakpoint up. Must be rendered inside the Redux `Provider`.
 *
 * The shows are sorted by the store's sort method. The Name, Date Completed, and Rating headers
 * are buttons that change it; on mobile, the sort dropdown in the toolbar does the same.
 *
 * Both layouts are rendered and CSS hides one. Hidden content (`display: none`) is also hidden
 * from screen readers, so each show is only announced once.
 *
 * @param props - See {@link ShowActionHandlers}.
 * @returns The card list and the table.
 */
export const ShowList: FC<ShowActionHandlers> = ({ onEdit, onDelete }) => {
  const shows = useAppSelector(selectSortedShows)
  const sortMethod = useAppSelector(selectSortMethod)
  const dispatch = useAppDispatch()
  const sortState = getSortState(sortMethod)

  /** Renders a sortable header for a column, marking it if the shows are sorted by it. */
  const renderSortableHeader = (column: SortColumn, label: string) => (
    <SortableColumnHeader
      label={label}
      direction={sortState.column === column ? sortState.direction : undefined}
      onSort={() => dispatch(setSortMethod(getNextSortOption(sortMethod, column)))}
      className={`${columnHeaderClassName} text-left`}
    />
  )

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
              {renderSortableHeader('name', 'Name')}
              <th scope="col" className={`${columnHeaderClassName} text-left`}>Status</th>
              {renderSortableHeader('date', 'Date Completed')}
              {renderSortableHeader('rating', 'Rating')}
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
