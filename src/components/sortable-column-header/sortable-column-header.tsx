import type { FC } from 'react'
import { focusRingClassName } from '../../utils/class-names'
import type { SortDirection } from '../../utils/sort-shows'
import { Icon, type IconName } from '../icon/icon'

/** Props for {@link SortableColumnHeader}. */
export interface SortableColumnHeaderProps {
  /** The column name, shown as the button's text. */
  label: string
  /** Which way this column is sorted, or `undefined` if the shows aren't sorted by it. */
  direction?: SortDirection
  /** Called when the button is clicked. */
  onSort: () => void
  /** Classes for the `<th>`, e.g. the padding and text styles shared by the header row. */
  className?: string
}

/** The icon for each direction. Unsorted columns get the neutral `Sort` icon. */
const iconNames: Record<SortDirection | 'none', IconName> = {
  none: 'Sort',
  ascending: 'ChevronUp',
  descending: 'ChevronDown',
}

/**
 * Column header of the shows table that sorts the shows when clicked.
 *
 * The `<th>` itself isn't interactive; it holds a `<button>`, so the keyboard works (Tab, then
 * Enter or Space). The sorted column's `<th>` has `aria-sort`; other columns have none. The icon is
 * decorative, so the button's accessible name is just the column name.
 *
 * @param props - See {@link SortableColumnHeaderProps}.
 * @returns The `<th>` element.
 */
export const SortableColumnHeader: FC<SortableColumnHeaderProps> = ({ label, direction, onSort, className }) => (
  <th scope="col" aria-sort={direction} className={className}>
    <button
      type="button"
      onClick={onSort}
      className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-1 rounded uppercase hover:text-neutral-900 ${focusRingClassName}`}
    >
      {label}
      <Icon name={iconNames[direction ?? 'none']} size={16} color="currentColor" />
    </button>
  </th>
)
