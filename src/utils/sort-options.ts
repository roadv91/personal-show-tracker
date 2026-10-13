/**
 * The ways shows can be sorted, with the text shown for each. The single source of truth for
 * both the `sort` slice and `ShowSortSelect`, so they can't drift apart.
 */
export const sortOptions = [
  { value: 'date-newest', label: 'Date: newest first' },
  { value: 'date-oldest', label: 'Date: oldest first' },
  { value: 'rating-highest', label: 'Rating: highest first' },
  { value: 'rating-lowest', label: 'Rating: lowest first' },
  { value: 'name-a-z', label: 'Name: A–Z' },
  { value: 'name-z-a', label: 'Name: Z–A' },
] as const

/** A sort choice, e.g. `date-newest`. */
export type SortOption = (typeof sortOptions)[number]['value']

/** The sort choice used until the user picks another. */
export const defaultSortOption: SortOption = 'date-newest'

/**
 * Checks whether a value is one of the {@link sortOptions}, e.g. when reading saved data.
 *
 * @param value - Any value.
 * @returns `true` if it's a known sort choice.
 */
export const isSortOption = (value: unknown): value is SortOption =>
  sortOptions.some((option) => option.value === value)
