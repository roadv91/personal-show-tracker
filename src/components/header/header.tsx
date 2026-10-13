import type { FC } from 'react'
import { Button } from '../button/button'

/** Props for {@link Header}. */
export interface HeaderProps {
  /** Called when the Add show button is clicked. */
  onAddShow: () => void
}

// TODO: Replace the hard-coded `#ffffff` background with a `color/white` primitive once it's added in Figma.
/**
 * White bar across the top of every page, with a bottom border. For now it only holds the
 * Add show button, at the far right of the screen (not limited to the page content's width).
 *
 * It's a `<header>` outside `<main>`, so screen readers expose it as the page's banner landmark.
 *
 * @param props - See {@link HeaderProps}.
 * @returns The header element.
 */
export const Header: FC<HeaderProps> = ({ onAddShow }) => (
  <header className="flex justify-end border-b border-neutral-200 bg-[#ffffff] px-4 py-3 tablet:px-8">
    <Button label="Add show" iconLeft="Plus" variant="primary" onClick={onAddShow} />
  </header>
)
