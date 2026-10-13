/** Every status a show can have. Also used at runtime, e.g. to check saved data. */
export const showStatuses = ['ongoing', 'completed', 'dropped'] as const

/** Where the user is with a show. */
export type ShowStatus = (typeof showStatuses)[number]

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

/** A show without its ID, e.g. as entered in the add form. The ID is generated when it's added. */
export type ShowInput = Omit<Show, 'id'>

/** Handlers for the edit and delete buttons shown with each show. */
export interface ShowActionHandlers {
  /** Called with the show when its edit button is clicked. */
  onEdit: (show: Show) => void
  /** Called with the show when its delete button is clicked. */
  onDelete: (show: Show) => void
}

/** Props for components that display one show with its edit and delete buttons. */
export interface ShowItemProps extends ShowActionHandlers {
  /** The show to display. */
  show: Show
}
