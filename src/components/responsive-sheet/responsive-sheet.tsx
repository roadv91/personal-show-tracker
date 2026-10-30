import type { FC } from 'react'
import { Dialog, type SheetProps } from '../dialog/dialog'

/**
 * Dialog that's a {@link BottomSheet} on phones and a centered {@link Modal} from the `tablet`
 * breakpoint up.
 *
 * It switches with CSS, so it stays the same `<dialog>` when the screen crosses the breakpoint
 * (e.g. rotating a tablet): it doesn't close, and focus and anything typed into it are kept.
 *
 * @param props - See {@link SheetProps}.
 * @returns The dialog element.
 */
export const ResponsiveSheet: FC<SheetProps> = (props) => <Dialog {...props} placement="responsive" />
