import type { FC } from 'react'
import { Icon } from './icon/icon'

/** Props for {@link ShowRating}. */
export interface ShowRatingProps {
  /** The rating, from 0 to 5. */
  rating: number
}

/**
 * A show's rating: an amber star followed by the rating with one decimal place, e.g. "4.0".
 *
 * The star is decorative and hidden from screen readers, which hear "Rating: 4.0 out of 5".
 * That also means the amber star's low contrast doesn't hide any information.
 *
 * @param props - See {@link ShowRatingProps}.
 * @returns The rating element.
 */
export const ShowRating: FC<ShowRatingProps> = ({ rating }) => (
  <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900">
    <Icon name="Star" size={16} color="var(--color-amber-500)" />
    <span>
      <span className="sr-only">Rating: </span>
      {rating.toFixed(1)}
      <span className="sr-only"> out of 5</span>
    </span>
  </span>
)
