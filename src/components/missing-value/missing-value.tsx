import type { FC } from 'react'

/** Props for {@link MissingValue}. */
export interface MissingValueProps {
  /** What screen readers announce instead of the dash, e.g. "No rating". */
  label: string
}

/**
 * A dash shown in place of a missing value, e.g. in a table cell. Screen readers skip the dash
 * and announce `label` instead, so the cell doesn't sound empty or read out "em dash".
 *
 * @param props - See {@link MissingValueProps}.
 * @returns The dash and its screen reader text.
 */
export const MissingValue: FC<MissingValueProps> = ({ label }) => (
  <>
    <span aria-hidden="true">—</span>
    <span className="sr-only">{label}</span>
  </>
)
