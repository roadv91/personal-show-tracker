import type { FC } from 'react'
import type { Show } from '../../types/show'
import type { SheetProps } from '../dialog/dialog'
import { ResponsiveSheet } from '../responsive-sheet/responsive-sheet'

/**
 * Whether {@link AddUpdateShow} adds a new show or edits one. `show` is required when editing and
 * not allowed when adding, so TypeScript catches an edit form without a show to edit.
 */
export type AddUpdateShowMode =
  | {
      /** Adds a new show. */
      mode: 'add'
      show?: never
    }
  | {
      /** Edits an existing show. */
      mode: 'edit'
      /** The show to edit; the form starts with its details. */
      show: Show
    }

/** Props for {@link AddUpdateShow}: the mode, plus whether the sheet is open. */
export type AddUpdateShowProps = AddUpdateShowMode & Pick<SheetProps, 'open' | 'onClose'>

/**
 * Sheet with the form for adding a new show or editing an existing one: a bottom sheet on phones
 * and a centered modal from the `tablet` breakpoint up (see {@link ResponsiveSheet}). Titled
 * "Add show" or "Edit show".
 *
 * The form is a placeholder for now; the fields come next.
 *
 * @param props - See {@link AddUpdateShowProps}.
 * @returns The sheet.
 */
export const AddUpdateShow: FC<AddUpdateShowProps> = ({ mode, show, open, onClose }) => (
  <ResponsiveSheet open={open} onClose={onClose} title={mode === 'edit' ? 'Edit show' : 'Add show'}>
    <p className="text-sm text-neutral-600">
      {mode === 'edit' ? `The edit form for ${show.name} will go here.` : 'The add show form will go here.'}
    </p>
  </ResponsiveSheet>
)
