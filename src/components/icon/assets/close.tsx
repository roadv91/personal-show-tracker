import type { FC } from 'react'

/**
 * Path data for the close (×) icon, drawn on a 24×24 grid. Render it through {@link Icon}.
 *
 * From Unicons by IconScout (https://iconscout.com/), IconScout Simple License. See the README credits.
 *
 * @returns The icon's `<path>` element.
 */
export const Close: FC = () => (
  <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
)
