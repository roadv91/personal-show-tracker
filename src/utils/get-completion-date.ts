import type { Show } from '../types/show'

/**
 * Gets the date to show as a show's completion date. Only completed shows have one, so a date left
 * on a show that's no longer completed (e.g. a rewatch set back to "ongoing") is never shown.
 *
 * @param show - The show.
 * @returns The ISO completion date, or `undefined` if the show isn't completed or has no date.
 */
export const getCompletionDate = (show: Show): string | undefined =>
  show.status === 'completed' ? show.dateCompleted : undefined
