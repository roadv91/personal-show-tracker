import type { FC } from 'react'
import { Dialog, type SheetProps } from '../dialog/dialog'

/**
 * Dialog centered on screen over a dimmed backdrop, up to 512px wide and 85% of the screen tall.
 * Closes with its close button, the Esc key, or a click on the backdrop.
 *
 * For a dialog that's a bottom sheet on phones, use {@link ResponsiveSheet}.
 *
 * @param props - See {@link SheetProps}.
 * @returns The dialog element.
 */
export const Modal: FC<SheetProps> = (props) => <Dialog {...props} placement="center" />
