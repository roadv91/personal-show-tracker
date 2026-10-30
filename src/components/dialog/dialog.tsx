import { useEffect, useId, useRef, type FC, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'
import { IconButton } from '../icon-button/icon-button'

/** Where the dialog sits on screen. */
export type DialogPlacement = 'center' | 'bottom' | 'responsive'

/*
 * Position, size, and corners for each placement. Written out in full so Tailwind can detect them.
 * `m-auto` (the browser default for modal dialogs) centers the dialog; `mt-auto mb-0` pins it to
 * the bottom. `responsive` is `bottom` below the `tablet` breakpoint and `center` from it up, so
 * keep its `tablet:` classes in sync with `center`.
 */
const placementClassNames: Record<DialogPlacement, string> = {
  center: 'm-auto w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] rounded-2xl',
  bottom: 'mt-auto mb-0 mx-0 w-full max-w-full max-h-[90dvh] rounded-t-2xl',
  responsive:
    'mt-auto mb-0 mx-0 w-full max-w-full max-h-[90dvh] rounded-t-2xl tablet:m-auto tablet:w-[calc(100%-2rem)] tablet:max-w-lg tablet:max-h-[85dvh] tablet:rounded-2xl',
}

/** Props for {@link Dialog}. */
export interface DialogProps {
  /** Whether the dialog is open. */
  open: boolean
  /**
   * Called when the user asks to close the dialog: the close button, the Esc key, or a click on
   * the dimmed backdrop. Set `open` to `false` in response; the dialog doesn't close itself.
   */
  onClose: () => void
  /** Heading at the top, also used as the dialog's accessible name. */
  title: string
  /** Content below the heading, e.g. a form. Scrolls when it's taller than the dialog. */
  children: ReactNode
  /** Where the dialog sits on screen. */
  placement: DialogPlacement
}

/**
 * Shared base of {@link Modal}, {@link BottomSheet}, and {@link ResponsiveSheet}: a native modal
 * `<dialog>` with a heading, a close button, and scrollable content. Use one of those three
 * instead of this directly.
 *
 * Opening it with `showModal()` gives the browser's built-in accessibility: focus moves into the
 * dialog (to the first focusable element, or one with `autoFocus`) and stays there, the page
 * behind can't be reached by keyboard or screen readers, and focus returns to the opening button
 * on close. The page behind also stops scrolling (see `index.css`).
 *
 * The content only renders while the dialog is open, so each opening starts fresh (e.g. a form
 * doesn't keep values from last time).
 *
 * Side effect: opens and closes the `<dialog>` element when `open` changes.
 *
 * @param props - See {@link DialogProps}.
 * @returns The dialog element.
 */
export const Dialog: FC<DialogProps> = ({ open, onClose, title, children, placement }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Whether the current click started on the backdrop, so selecting text inside the dialog and
  // releasing the mouse outside it doesn't close it
  const pressStartedOnBackdropRef = useRef(false)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  /** Esc fires `cancel`; let the parent close the dialog through `open` instead of the browser. */
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  /**
   * Whether a click landed on the dimmed backdrop. The browser reports backdrop clicks as clicks on
   * the `<dialog>` element. Clicks inside the visible box never target `<dialog>` directly: it has
   * no padding, so the content `<div>` covers all of it and receives them instead.
   */
  const isBackdrop = (event: MouseEvent<HTMLDialogElement>) => event.target === event.currentTarget

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onPointerDown={(event) => (pressStartedOnBackdropRef.current = isBackdrop(event))}
      onClick={(event) => {
        if (pressStartedOnBackdropRef.current && isBackdrop(event)) onClose()
      }}
      className={`border-0 bg-white p-0 text-neutral-900 shadow-lg backdrop:bg-neutral-950/50 ${placementClassNames[placement]}`}
    >
      {open && (
        // max-h-[inherit] matches the dialog's max height, so the body scrolls and the header stays put
        <div className="flex max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-2 tablet:px-6 tablet:pt-6">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            <IconButton name="Close" label="Close" showBackground={false} onClick={onClose} />
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pt-2 pb-6 tablet:px-6">
            {children}
          </div>
        </div>
      )}
    </dialog>
  )
}
