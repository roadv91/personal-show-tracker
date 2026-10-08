import type { FC } from 'react'
import { ShowSortSelect } from './show-sort-select'
import { ToolbarButton } from './toolbar-button'

/** Props for {@link ShowListHeader}. */
export interface ShowListHeaderProps {
  /** How many shows are listed. */
  showCount: number
  /** Called when the Filter button is clicked. */
  onFilter: () => void
  /** Called when the Add show button is clicked. */
  onAddShow: () => void
}

/**
 * Page header above {@link ShowList}: the "My Shows" heading, the show count, and the list controls.
 *
 * The count always sits under the heading, left-aligned.
 *
 * - Mobile: Add show sits beside the heading, and the sort dropdown and Filter button form a
 *   second row.
 * - Tablet and up: Filter and Add show sit beside the heading. There's no sort dropdown, since
 *   the table will be sorted from its column headers.
 *
 * The Filter button is rendered once per layout, with CSS hiding the other, so the focus order
 * always matches the visual order. Hidden elements (`display: none`) are also hidden from screen
 * readers and keyboard focus. The count is a live region, so screen readers announce changes.
 *
 * @param props - See {@link ShowListHeaderProps}.
 * @returns The header element.
 */
export const ShowListHeader: FC<ShowListHeaderProps> = ({ showCount, onFilter, onAddShow }) => {
  const filterButton = <ToolbarButton label="Filter" icon="Filter" variant="secondary" onClick={onFilter} />

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-neutral-900 tablet:text-3xl">My Shows</h1>
          <p aria-live="polite" className="text-xs text-neutral-600 tablet:text-sm">
            {showCount} {showCount === 1 ? 'show' : 'shows'}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="hidden tablet:block">{filterButton}</div>
          <ToolbarButton label="Add show" icon="Plus" variant="primary" onClick={onAddShow} />
        </div>
      </div>
      <div className="flex gap-2 tablet:hidden">
        <ShowSortSelect />
        {filterButton}
      </div>
    </header>
  )
}
