import type { ButtonHTMLAttributes, FC } from 'react'
import { focusRingClassName } from '../utils/class-names'
import { Icon, type IconName } from './icon/icon'

/**
 * Looks of {@link ToolbarButton}: `primary` for the main action (e.g. "Add show"),
 * `secondary` for everything else (e.g. "Filter").
 */
export type ToolbarButtonVariant = 'primary' | 'secondary'

// TODO: Create `toolbar-button/*` semantic tokens in Figma and use them here instead of primitives,
// including a `color/white` primitive for the hard-coded `#ffffff` colors.
/** Colors and font weight for each variant. Written out in full so Tailwind can detect them. */
const variantClassNames: Record<ToolbarButtonVariant, string> = {
  primary: 'bg-neutral-900 font-bold text-[#ffffff] hover:bg-neutral-800 active:bg-neutral-700',
  secondary:
    'border border-neutral-300 bg-[#ffffff] text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100',
}

/**
 * Props for {@link ToolbarButton}. Also accepts the usual `<button>` attributes, such as `onClick`
 * or `aria-expanded` (for a button that opens a panel).
 */
export interface ToolbarButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  /** Text shown on the button, which is also its accessible name. */
  label: string
  /** Icon shown before the label. It's decorative, so it's hidden from screen readers. */
  icon: IconName
  /** Look of the button. */
  variant: ToolbarButtonVariant
}

/**
 * Button with an icon and a text label, used in toolbars (e.g. "Filter" and "Add show").
 *
 * It's 44px tall, which meets the recommended touch target size, and the label never wraps.
 * The left padding is slightly smaller than the right because icons have built-in empty space
 * around their shape; equal padding would make the left side look wider.
 * `type` defaults to `"button"` so it never submits a form by accident.
 *
 * @param props - See {@link ToolbarButtonProps}.
 * @returns The button element.
 */
export const ToolbarButton: FC<ToolbarButtonProps> = ({ label, icon, variant, type = 'button', ...buttonProps }) => (
  <button
    {...buttonProps}
    type={type}
    className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg pr-3 pl-2.5 text-sm whitespace-nowrap ${focusRingClassName} ${variantClassNames[variant]}`}
  >
    {/* `currentColor` makes the icon match the label's color */}
    <Icon name={icon} size={20} color="currentColor" />
    {label}
  </button>
)
