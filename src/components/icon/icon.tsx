import type { FC } from 'react'
import { iconComponentsMap, type IconName } from './icon-components-map'

export type { IconName }

/** Props for {@link Icon}. */
export interface IconProps {
  /** Which icon to render. */
  name: IconName
  /**
   * Width and height of the icon in pixels.
   * @default 24
   */
  size?: number
  /**
   * Fill color. Accepts any CSS color: a design token (`var(--color-badge-ongoing-text)`),
   * hex, `rgb()`, a named color, etc. The default inherits the parent's text color.
   * @default 'currentColor'
   */
  color?: string
  /**
   * Accessible name for the icon. Set it when the icon is the only content conveying meaning
   * (e.g. an icon-only button). Leave it out for decorative icons next to visible text,
   * which hides the icon from screen readers.
   */
  label?: string
}

// TODO: Add grey-scale tokens in Figma and apply one here as the default icon color.
/**
 * SVG icon drawn on a 24×24 grid.
 *
 * Set the color with the `color` prop, or leave it out to inherit the parent's text color.
 *
 * @param props - See {@link IconProps}.
 * @returns The icon's `<svg>` element.
 */
export const Icon: FC<IconProps> = ({ name, size = 24, color = 'currentColor', label }) => {
  const PathComponent = iconComponentsMap[name]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className="shrink-0"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <PathComponent />
    </svg>
  )
}
