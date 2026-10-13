/**
 * Describes how many shows there are, e.g. "1 show" or "7 shows".
 *
 * @param count - The number of shows.
 * @returns The count with "show" or "shows".
 */
export const formatShowCount = (count: number): string => `${count} ${count === 1 ? 'show' : 'shows'}`
