import type { FC } from 'react'

/**
 * Path data for the plus icon, drawn on a 24×24 grid. Render it through {@link Icon}.
 *
 * From Unicons by IconScout (https://iconscout.com/), IconScout Simple License. See the README credits.
 *
 * @returns The icon's `<path>` element.
 */
export const Plus: FC = () => (
  <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z" />
)
