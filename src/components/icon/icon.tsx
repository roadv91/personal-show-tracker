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
   * Fill color. Accepts any CSS color: a design token (`var(--color-badge-ongoing-content)`),
   * hex, `rgb()`, a named color, `currentColor` to inherit the parent's text color, etc.
   * @default 'var(--color-icon-content)'
   */
  color?: string
  /**
   * Accessible name for the icon. Set it when the icon is the only content conveying meaning
   * (e.g. an icon-only button). Leave it out for decorative icons next to visible text,
   * which hides the icon from screen readers.
   */
  label?: string
}

/**
 * SVG icon drawn on a 24×24 grid.
 *
 * Uses the `icon/content` token color unless the `color` prop sets another one.
 *
 * @param props - See {@link IconProps}.
 * @returns The icon's `<svg>` element.
 */
export const Icon: FC<IconProps> = ({ name, size = 24, color = 'var(--color-icon-content)', label }) => {
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
