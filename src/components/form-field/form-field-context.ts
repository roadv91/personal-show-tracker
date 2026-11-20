import { createContext, use } from 'react'

/**
 * What a {@link FormField} tells the input inside it, so the input can link itself to the
 * field's label and messages for screen readers.
 */
export interface FormFieldControlProps {
  /** `id` for the input, which the field's `<label>` points to with `htmlFor`. */
  id: string
  /** Ids of the description or error message, space-separated, or `undefined` if there are none. */
  'aria-describedby': string | undefined
  /** `true` while the field shows an error. */
  'aria-invalid': boolean
  /** Whether the field must be filled in. */
  required: boolean
  /** Whether the field is disabled. */
  disabled: boolean
}

/** Shares a {@link FormField}'s ids and state with the input inside it. */
export const FormFieldContext = createContext<FormFieldControlProps | null>(null)

/**
 * Gets the props an input needs from the {@link FormField} around it. Spread them onto the
 * input element: `<input {...useFormFieldControl()} />`.
 *
 * @returns The input props (`id`, `aria-describedby`, `aria-invalid`, `required`, `disabled`).
 * @throws If the input isn't inside a `FormField`, because it would have no accessible label.
 */
export const useFormFieldControl = (): FormFieldControlProps => {
  const controlProps = use(FormFieldContext)
  if (!controlProps) {
    throw new Error('useFormFieldControl must be used inside a FormField.')
  }
  return controlProps
}
