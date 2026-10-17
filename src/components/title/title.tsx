import type { FC } from 'react'

/** Props for {@link Title}. */
export interface TitleProps {
  /** The page's main heading, e.g. "My Shows". */
  title: string
  /** Short text shown under the heading, e.g. "7 shows". */
  description: string
}

/**
 * The page's main heading (`<h1>`) with a short description under it, both left-aligned.
 *
 * @param props - See {@link TitleProps}.
 * @returns The heading and description.
 */
export const Title: FC<TitleProps> = ({ title, description }) => (
  <div className="flex flex-col">
    <h1 className="text-xl font-bold text-neutral-900 tablet:text-3xl">{title}</h1>
    <p className="text-xs text-neutral-600 tablet:text-sm">
      {description}
    </p>
  </div>
)
