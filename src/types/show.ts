/** Where the user is with a show. */
export type ShowStatus = 'ongoing' | 'completed' | 'dropped'

/** A show the user is tracking. */
export interface Show {
  /** Unique ID, used as the React key. */
  id: string
  /** Title of the show. */
  name: string
  /** Where the user is with the show. */
  status: ShowStatus
  /** The user's rating, from 0 to 5 in steps of 0.1. */
  rating: number
  /**
   * Date the user finished the show, as an ISO date (`YYYY-MM-DD`). Optional even for completed shows,
   * since users may not remember it. Read it with `getCompletionDate`, which ignores it unless the show is completed.
   */
  dateCompleted?: string
  /** The user's notes on the show, up to 250 characters. */
  notes?: string
}
