import { useId, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectSortMethod, setSortMethod } from '../../store/shows-slice'
import { focusRingClassName } from '../../utils/class-names'
import { sortOptions, type SortOption } from '../../utils/sort-options'
import { Icon } from '../icon/icon'

// TODO: Create semantic tokens in Figma and use them instead of primitives and the hard-coded `#ffffff`.
/**
 * Dropdown for choosing how shows are sorted, shown in the mobile layout of {@link Toolbar}.
 * It shows the sort method in the Redux store and dispatches `setSortMethod` when changed, so it
 * stays in step with the column headers of {@link ShowList}. Must be rendered inside the Redux `Provider`.
 *
 * It's a native `<select>`, so keyboard, screen reader, and phone pickers work out of the box.
 * The chevron is decorative and drawn on top of it. A visually hidden "Sort by" label gives it an
 * accessible name, so screen readers announce e.g. "Sort by, Date: newest first".
 *
 * @returns The labeled select.
 */
export const ShowSortSelect: FC = () => {
  const selectId = useId()
  const sortMethod = useAppSelector(selectSortMethod)
  const dispatch = useAppDispatch()

  return (
    <div className="relative flex min-w-0 flex-1 items-center text-neutral-900">
      <label htmlFor={selectId} className="sr-only">
        Sort by
      </label>
      <select
        id={selectId}
        value={sortMethod}
        onChange={(event) => dispatch(setSortMethod(event.target.value as SortOption))}
        className={`min-h-11 w-full min-w-0 cursor-pointer appearance-none truncate rounded-lg border border-neutral-300 bg-[#ffffff] pr-9 pl-3 text-sm hover:bg-neutral-50 ${focusRingClassName}`}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* pointer-events-none lets clicks on the chevron reach the select underneath */}
      <span className="pointer-events-none absolute right-2.5">
        <Icon name="ChevronDown" size={20} color="currentColor" />
      </span>
    </div>
  )
}
