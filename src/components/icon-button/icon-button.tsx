import type { FC, MouseEventHandler } from 'react'
import { Icon, type IconName } from '../icon/icon'

/** Props for {@link IconButton}. */
export interface IconButtonProps {
  /** Which icon to show. */
  name: IconName
  /** Accessible name of the button, announced by screen readers (e.g. "Delete show"). */
  label: string
  /** Called when the button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /**
   * Width and height of the icon in pixels. The button stays 44×44px and centers the icon,
   * so the default 18px icon has 13px of space on each side.
   * @default 18
   */
  size?: number
  /**
   * Icon color. Accepts any CSS color, e.g. a design token (`var(--color-red-500)`).
   * Ignored while the button is disabled, which always uses the disabled grey.
   * The default is the `icon-button/content` token.
   */
  color?: string
  /**
   * Shows the grey background (`icon-button/surface`) in every state. Without it, only the icon
   * darkens on hover and press.
   * @default true
   */
  showBackground?: boolean
  /**
   * Disables the button.
   * @default false
   */
  disabled?: boolean
}

/** Background colors for each state. Written out in full so Tailwind can detect them. */
const backgroundClassName =
  'bg-icon-button-surface enabled:hover:bg-icon-button-surface-hover enabled:active:bg-icon-button-surface-active'

/**
 * Button showing only an icon, with hover, active, focus, and disabled states.
 *
 * It's a fixed 44×44px tap target with 16px rounded corners. By default it has a light grey
 * background (`icon-button/surface`) that darkens on hover and darkens further on press; set
 * `showBackground` to `false` to hide it. The icon darkens along with it, using a brightness
 * filter, so this works with any icon color (except pure black, which can't get darker).
 *
 * The icon is hidden from screen readers; `label` is the button's accessible name.
 * The keyboard focus ring is 2px wide with a 2px gap, so it stays visible on any background.
 *
 * @param props - See {@link IconButtonProps}.
 * @returns The button element.
 */
export const IconButton: FC<IconButtonProps> = ({
  name,
  label,
  onClick,
  size = 18,
  color,
  showBackground = true,
  disabled = false,
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-icon-button-content enabled:hover:*:brightness-85 enabled:active:*:brightness-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-icon-button-focus-ring disabled:cursor-not-allowed disabled:text-icon-button-content-disabled ${showBackground ? backgroundClassName : ''}`}
  >
    {/* `currentColor` lets the button's text color (including the disabled color) reach the icon */}
    <Icon name={name} size={size} color={color && !disabled ? color : 'currentColor'} />
  </button>
)
