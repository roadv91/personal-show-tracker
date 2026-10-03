import type { FC, MouseEventHandler } from 'react'
import { Icon, type IconName } from './icon/icon'

/** Props for {@link IconButton}. */
export interface IconButtonProps {
  /** Which icon to show. */
  name: IconName
  /** Accessible name of the button, announced by screen readers (e.g. "Delete show"). */
  label: string
  /** Called when the button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /**
   * Width and height of the icon in pixels. The button is at least 32×32px and grows to fit larger icons.
   * @default 24
   */
  size?: number
  /**
   * Disables the button.
   * @default false
   */
  disabled?: boolean
}

// TODO: Replace the placeholder raw colors with `icon-button/*` design tokens once they exist in Figma.
/**
 * Button showing only an icon, with hover, active, focus, and disabled states.
 *
 * On hover the icon darkens slightly, and on press it darkens further. This uses a brightness
 * filter, so it works with any icon color (except pure black, which can't get darker).
 *
 * The icon is hidden from screen readers; `label` is the button's accessible name.
 * The tap target is at least 32×32px, or the icon's size if that's larger.
 *
 * @param props - See {@link IconButtonProps}.
 * @returns The button element.
 */
export const IconButton: FC<IconButtonProps> = ({ name, label, onClick, size = 24, disabled = false }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-sm text-[#404040] enabled:hover:*:brightness-85 enabled:active:*:brightness-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:text-[#a3a3a3]"
  >
    <Icon name={name} size={size} />
  </button>
)
