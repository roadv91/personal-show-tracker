import { useId, type FC, type ReactNode } from 'react'
import { FormFieldContext, type FormFieldControlProps } from './form-field-context'

/** Props for {@link FormField}. */
export interface FormFieldProps {
  /** Text of the field's label, which is also the input's accessible name. Always required. */
  label: string
  /** Hides the label visually but keeps it for screen readers. Defaults to `false`. */
  hideLabel?: boolean
  /** Whether the field must be filled in. Shows a `*` after the label. Defaults to `false`. */
  required?: boolean
  /** Hides the `*` on a required field (e.g. when every field in a form is required). */
  hideRequiredStar?: boolean
  /** Helper text shown below the input. Hidden while there's an error, unless `showDescriptionOnError`. */
  description?: string
  /** Keeps the description visible below the error message. Defaults to `false`. */
  showDescriptionOnError?: boolean
  /**
   * Error message shown below the input, in place of the description (or above it, with
   * `showDescriptionOnError`). The field doesn't decide
   * when to show it: the form (or whoever renders the field) passes it in.
   */
  error?: string
  /**
   * Whether the field is disabled. Defaults to `false`. A disabled field ignores `error`, since it
   * can't be fixed: no message, and the input isn't marked invalid.
   */
  disabled?: boolean
  /** `id` for the input. Defaults to a generated one; pass one to target the input (e.g. to focus it). */
  id?: string
  /** The input. It gets its `id` and ARIA attributes from {@link useFormFieldControl}. */
  children: ReactNode
}

/**
 * Wraps an input with its label, an optional description, and an error message, stacked
 * vertically. Every input in a form sits inside one.
 *
 * It only displays what it's given and stores no state, so it works the same for an input used
 * on its own and for one connected to a form. The input inside reads the field's ids and state
 * with {@link useFormFieldControl}, which links it to the label (`htmlFor`) and to the
 * description or error (`aria-describedby`, `aria-invalid`), so screen readers announce them.
 *
 * Accessibility: the `*` is hidden from screen readers, since the input's `required` attribute
 * already announces it. The error isn't announced the moment it appears (that would be noisy
 * while typing); screen readers read it when the input is focused.
 *
 * It fills the width of its container; the form or page layout decides how wide fields are.
 *
 * @param props - See {@link FormFieldProps}.
 * @returns The field element.
 */
export const FormField: FC<FormFieldProps> = ({
  label,
  hideLabel = false,
  required = false,
  hideRequiredStar = false,
  description,
  showDescriptionOnError = false,
  error: givenError,
  disabled = false,
  id,
  children,
}) => {
  const error = disabled ? undefined : givenError
  const generatedId = useId()
  const controlId = id ?? generatedId
  const errorId = `${controlId}-error`
  const descriptionId = `${controlId}-description`
  const showDescription = Boolean(description) && (!error || showDescriptionOnError)
  // Screen readers read these in order: the error first, then the description.
  const describedByIds = [error && errorId, showDescription && descriptionId].filter(Boolean)

  const controlProps: FormFieldControlProps = {
    id: controlId,
    'aria-describedby': describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
    'aria-invalid': Boolean(error),
    required,
    disabled,
  }

  // TODO: Remove the unused `size/input-width` token in Figma, then run `npm run build:tokens`.
  return (
    <div className="flex flex-col gap-input-spacing-content">
      <label
        htmlFor={controlId}
        className={`text-sm leading-5 font-semibold ${disabled ? 'text-input-content-disabled' : 'text-input-label-content'} ${hideLabel ? 'sr-only' : ''}`}
      >
        {label}
        {required && !hideRequiredStar && <span aria-hidden="true"> *</span>}
      </label>
      <FormFieldContext value={controlProps}>{children}</FormFieldContext>
      {error && (
        <p id={errorId} className="text-xs leading-5 text-input-error-message-content">
          {error}
        </p>
      )}
      {showDescription && (
        <p
          id={descriptionId}
          className={`text-xs leading-5 ${disabled ? 'text-input-content-disabled' : 'text-input-description-content'}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}
