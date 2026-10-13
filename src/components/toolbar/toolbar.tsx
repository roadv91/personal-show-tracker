import type { FC } from 'react'
import { Button } from '../button/button'
import { ShowSortSelect } from '../show-sort-select/show-sort-select'

/** Props for {@link Toolbar}. */
export interface ToolbarProps {
  /** Called when the Filter button is clicked. */
  onFilter: () => void
}

/**
 * Controls for the show list: the sort dropdown and the Filter button.
 *
 * On mobile the dropdown fills the row next to Filter. From the `tablet` breakpoint up only
 * Filter shows, since the table will be sorted from its column headers.
 *
 * @param props - See {@link ToolbarProps}.
 * @returns The toolbar element.
 */
export const Toolbar: FC<ToolbarProps> = ({ onFilter }) => (
  <div className="flex gap-2">
    <div className="flex min-w-0 flex-1 tablet:hidden">
      <ShowSortSelect />
    </div>
    <Button label="Filter" iconLeft="Filter" variant="secondary" onClick={onFilter} />
  </div>
)
