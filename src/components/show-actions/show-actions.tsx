import type { FC } from 'react'
import type { ShowItemProps } from '../../types/show'
import { IconButton } from '../icon-button/icon-button'

/**
 * Edit and delete buttons for a show.
 *
 * Each button's accessible name includes the show name, so screen reader users can tell
 * the buttons of different shows apart.
 *
 * @param props - See {@link ShowItemProps}.
 * @returns The two buttons, side by side.
 */
export const ShowActions: FC<ShowItemProps> = ({ show, onEdit, onDelete }) => (
  <div className="flex shrink-0 items-center gap-1">
    <IconButton name="Edit" label={`Edit ${show.name}`} onClick={() => onEdit(show)} />
    <IconButton name="Trash" label={`Delete ${show.name}`} color="var(--color-red-500)" onClick={() => onDelete(show)} />
  </div>
)
