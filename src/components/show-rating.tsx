import type { FC } from 'react'
import { Icon } from './icon/icon'

/** Props for {@link ShowRating}. */
export interface ShowRatingProps {
  /** The rating, from 0 to 5. */
  rating: number
}

/**
 * Formats ratings with exactly one decimal place, cutting off extra digits instead of rounding
 * (4.99 → "4.9", not "5.0"). Unlike `Math.trunc(rating * 10)`, this works on the number's decimal
 * form, so floating-point errors can't push a value like 0.29 down to the wrong digit.
 */
const ratingFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  roundingMode: 'trunc',
})

// TODO: Replace the hard-coded `#d97706` star color with the `color/amber/600` primitive once it's added in Figma.
/**
 * A show's rating: an amber star followed by the rating with one decimal place, e.g. "4.0".
 * Extra decimals are truncated, not rounded. The text is 12px in the mobile cards and 14px in the
 * table, which only shows from the `tablet` breakpoint up.
 *
 * The star is decorative and hidden from screen readers, which hear "Rating: 4.0 out of 5".
 * Its amber (`#d97706`) still has 3.2:1 contrast on white, enough for low-vision users to see it.
 *
 * @param props - See {@link ShowRatingProps}.
 * @returns The rating element.
 */
export const ShowRating: FC<ShowRatingProps> = ({ rating }) => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 tablet:text-sm">
    <Icon name="Star" size={16} color="#d97706" />
    <span>
      <span className="sr-only">Rating: </span>
      {ratingFormatter.format(rating)}
      <span className="sr-only"> out of 5</span>
    </span>
  </span>
)
