import type { ButtonHTMLAttributes, FC } from 'react'
import { focusRingClassName } from '../../utils/class-names'
import { Icon, type IconName } from '../icon/icon'

/**
 * Looks of {@link Button}: `primary` for the main action (e.g. "Add show"),
 * `secondary` for everything else (e.g. "Filter").
 */
export type ButtonVariant = 'primary' | 'secondary'

// TODO: Create `button/*` semantic tokens in Figma and use them here instead of primitives.
/** Colors and font weight for each variant. Written out in full so Tailwind can detect them. */
const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-neutral-900 font-bold text-white hover:bg-neutral-800 active:bg-neutral-700',
  secondary:
    'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100',
}

/**
 * Props for {@link Button}. Also accepts the usual `<button>` attributes, such as `onClick`,
 * `type`, or `aria-expanded` (for a button that opens a panel).
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  /** Text shown on the button, which is also its accessible name. */
  label: string
  /** Optional icon shown before the label. It's decorative, so it's hidden from screen readers. */
  iconLeft?: IconName
  /** Look of the button. */
  variant: ButtonVariant
}

/**
 * Button with a text label and an optional icon before it (e.g. "Filter" and "Add show").
 *
 * It's 44px tall, which meets the recommended touch target size, and the content is centered
 * and never wraps. With an icon, the left padding is slightly smaller than the right because
 * icons have built-in empty space around their shape; equal padding would make the left side
 * look wider. Without one, the padding is equal.
 *
 * `type` defaults to `"button"` so it never submits a form by accident, but can be overridden.
 *
 * @param props - See {@link ButtonProps}.
 * @returns The button element.
 */
export const Button: FC<ButtonProps> = ({ label, iconLeft, variant, ...buttonProps }) => (
  <button
    type="button"
    {...buttonProps}
    className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm whitespace-nowrap ${iconLeft ? 'pr-3 pl-2.5' : 'px-3'} ${focusRingClassName} ${variantClassNames[variant]}`}
  >
    {/* `currentColor` makes the icon match the label's color */}
    {iconLeft && <Icon name={iconLeft} size={20} color="currentColor" />}
    {label}
  </button>
)
