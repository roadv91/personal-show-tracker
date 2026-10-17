import { useId, type FC } from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectSortMethod } from '../../store/shows-slice'
import { focusRingClassName } from '../../utils/class-names'
import { sortOptions } from '../../utils/sort-options'
import { Icon } from '../icon/icon'

// TODO: Make sorting work: control the value, dispatch `setSortMethod` on change, and sort the shows.
// TODO: Create semantic tokens in Figma and use them instead of primitives and the hard-coded `#ffffff`.
/**
 * Dropdown for choosing how shows are sorted, shown in the mobile layout of {@link Toolbar}.
 * It starts on the sort method in the Redux store, but changing it doesn't do anything yet.
 * Must be rendered inside the Redux `Provider`.
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

  return (
    <div className="relative flex min-w-0 flex-1 items-center text-neutral-900">
      <label htmlFor={selectId} className="sr-only">
        Sort by
      </label>
      <select
        id={selectId}
        defaultValue={sortMethod}
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
