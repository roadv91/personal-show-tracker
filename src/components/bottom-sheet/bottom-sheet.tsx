import type { FC } from 'react'
import { Dialog, type SheetProps } from '../dialog/dialog'

/**
 * Dialog pinned to the bottom of the screen at full width, with rounded top corners, up to 90%
 * of the screen tall. Closes with its close button, the Esc key, or a tap on the dimmed backdrop.
 * There's no swipe-to-close yet.
 *
 * For a dialog that's centered on larger screens, use {@link ResponsiveSheet}.
 *
 * @param props - See {@link SheetProps}.
 * @returns The dialog element.
 */
export const BottomSheet: FC<SheetProps> = (props) => <Dialog {...props} placement="bottom" />
