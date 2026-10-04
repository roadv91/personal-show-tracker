import type { FC } from 'react'

/**
 * Formats dates like "Sep 5, 2026" in the user's time zone. The locale is fixed so the format
 * doesn't depend on the browser's language.
 */
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/** Props for {@link FormattedDate}. */
export interface FormattedDateProps {
  /** The date to show, as an ISO date (`YYYY-MM-DD`). */
  isoDate: string
}

/**
 * A date shown like "Sep 5, 2026", with the exact date in the `<time>` element's `dateTime` attribute.
 *
 * @param props - See {@link FormattedDateProps}.
 * @returns The `<time>` element.
 */
export const FormattedDate: FC<FormattedDateProps> = ({ isoDate }) => (
  // A date-only ISO string (`2026-09-05`) is parsed as UTC midnight, which is the previous day in
  // time zones behind UTC. Adding a time without an offset makes it parse as local midnight instead.
  <time dateTime={isoDate}>{dateFormatter.format(new Date(`${isoDate}T00:00`))}</time>
)
