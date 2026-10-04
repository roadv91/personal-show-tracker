import type { FC } from 'react'
import { IconButton } from './icon-button'

/** Props for {@link ShowActions}. */
export interface ShowActionsProps {
  /** Name of the show, used in the buttons' accessible names (e.g. "Edit Severance"). */
  showName: string
  /** Called when the edit button is clicked. */
  onEdit: () => void
  /** Called when the delete button is clicked. */
  onDelete: () => void
}

/**
 * Edit and delete buttons for a show.
 *
 * Each button's accessible name includes the show name, so screen reader users can tell
 * the buttons of different shows apart.
 *
 * @param props - See {@link ShowActionsProps}.
 * @returns The two buttons, side by side.
 */
export const ShowActions: FC<ShowActionsProps> = ({ showName, onEdit, onDelete }) => (
  <div className="flex shrink-0 items-center gap-1">
    <IconButton name="Edit" label={`Edit ${showName}`} size={20} onClick={onEdit} />
    <IconButton name="Trash" label={`Delete ${showName}`} size={20} color="var(--color-red-500)" onClick={onDelete} />
  </div>
)
