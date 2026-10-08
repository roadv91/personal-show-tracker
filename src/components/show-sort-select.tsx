import { useId, type FC } from 'react'
import { focusRingClassName } from '../utils/class-names'
import { Icon } from './icon/icon'

/** The ways shows can be sorted, with the text shown for each. */
const sortOptions = [
  { value: 'date-newest', label: 'Date: newest first' },
  { value: 'date-oldest', label: 'Date: oldest first' },
  { value: 'rating-highest', label: 'Rating: highest first' },
  { value: 'rating-lowest', label: 'Rating: lowest first' },
  { value: 'name-a-z', label: 'Name: A–Z' },
  { value: 'name-z-a', label: 'Name: Z–A' },
]

// TODO: Make sorting work: control the value, report changes with an `onChange` prop, and sort the shows.
// TODO: Create semantic tokens in Figma and use them instead of primitives and the hard-coded `#ffffff`.
/**
 * Dropdown for choosing how shows are sorted, shown in the mobile layout of {@link ShowListHeader}.
 * It doesn't sort anything yet.
 *
 * It's a native `<select>`, so keyboard, screen reader, and phone pickers work out of the box.
 * The sort and chevron icons are decorative and drawn on top of it. A visually hidden "Sort by"
 * label gives it an accessible name, so screen readers announce "Sort by, Date: newest first".
 *
 * @returns The labeled select.
 */
export const ShowSortSelect: FC = () => {
  const selectId = useId()

  return (
    <div className="relative flex min-w-0 flex-1 items-center text-neutral-900">
      <label htmlFor={selectId} className="sr-only">
        Sort by
      </label>
      {/* pointer-events-none lets clicks on the icons reach the select underneath */}
      <span className="pointer-events-none absolute left-2.5">
        <Icon name="Sort" size={20} color="currentColor" />
      </span>
      <select
        id={selectId}
        defaultValue="date-newest"
        className={`min-h-11 w-full min-w-0 cursor-pointer appearance-none truncate rounded-lg border border-neutral-300 bg-[#ffffff] pr-9 pl-9 text-sm hover:bg-neutral-50 ${focusRingClassName}`}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5">
        <Icon name="ChevronDown" size={20} color="currentColor" />
      </span>
    </div>
  )
}
