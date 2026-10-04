import type { FC } from 'react'
import { Icon } from './icon/icon'

/** Props for {@link ShowRating}. */
export interface ShowRatingProps {
  /** The rating, from 0 to 5. */
  rating: number
}

// TODO: Replace the hard-coded `#d97706` star color with the `color/amber/600` primitive once it's added in Figma.
/**
 * A show's rating: an amber star followed by the rating with one decimal place, e.g. "4.0".
 *
 * The star is decorative and hidden from screen readers, which hear "Rating: 4.0 out of 5".
 * Its amber (`#d97706`) still has 3.2:1 contrast on white, enough for low-vision users to see it.
 *
 * @param props - See {@link ShowRatingProps}.
 * @returns The rating element.
 */
export const ShowRating: FC<ShowRatingProps> = ({ rating }) => (
  <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900">
    <Icon name="Star" size={16} color="#d97706" />
    <span>
      <span className="sr-only">Rating: </span>
      {rating.toFixed(1)}
      <span className="sr-only"> out of 5</span>
    </span>
  </span>
)
