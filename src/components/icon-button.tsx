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
   * Width and height of the icon in pixels. The button itself is always at least 44×44px.
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
 * The icon is hidden from screen readers; `label` is the button's accessible name.
 * The button is at least 44×44px so it's easy to tap on touch screens.
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
    className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-[#404040] enabled:hover:bg-[#f5f5f5] enabled:active:bg-[#e5e5e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:text-[#a3a3a3]"
  >
    <Icon name={name} size={size} />
  </button>
)
