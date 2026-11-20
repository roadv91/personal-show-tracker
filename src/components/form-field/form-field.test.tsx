import { render, screen } from '@testing-library/react'
import type { FC } from 'react'
import { describe, expect, it } from 'vitest'
import { FormField, type FormFieldProps } from './form-field'
import { useFormFieldControl } from './form-field-context'

/** Minimal input that connects itself to the surrounding FormField. */
const TestInput: FC = () => <input {...useFormFieldControl()} />

/** Renders a FormField with {@link TestInput} inside, plus any props given. */
const renderField = (props: Partial<FormFieldProps> = {}) =>
  render(
    <FormField label="Name" {...props}>
      <TestInput />
    </FormField>,
  )

describe('FormField', () => {
  it('names the input by its label', () => {
    renderField()
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })

  it('keeps a hidden label for screen readers', () => {
    renderField({ hideLabel: true })
    expect(screen.getByText('Name')).toHaveClass('sr-only')
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })

  it('marks a required field with a * hidden from screen readers', () => {
    renderField({ required: true })
    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('can hide the * on a required field', () => {
    renderField({ required: true, hideRequiredStar: true })
    expect(screen.getByRole('textbox')).toBeRequired()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('links the description to the input', () => {
    renderField({ description: 'As shown on the poster.' })
    const input = screen.getByRole('textbox')
    expect(input).toHaveAccessibleDescription('As shown on the poster.')
    expect(input).not.toBeInvalid()
  })

  it('shows the error in place of the description and marks the input invalid', () => {
    renderField({ description: 'As shown on the poster.', error: 'Enter a name.' })
    const input = screen.getByRole('textbox')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Enter a name.')
    expect(screen.queryByText('As shown on the poster.')).not.toBeInTheDocument()
  })

  it('links the error to the input when there is no description', () => {
    renderField({ error: 'Enter a name.' })
    const input = screen.getByRole('textbox')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Enter a name.')
  })

  it('can keep the description below the error', () => {
    renderField({ description: 'As shown on the poster.', error: 'Enter a name.', showDescriptionOnError: true })
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Enter a name. As shown on the poster.')
  })

  it('has no description link when there is no message', () => {
    renderField()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  it('disables the input', () => {
    renderField({ disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('uses the given id for the input', () => {
    renderField({ id: 'show-name' })
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'show-name')
  })

  it('throws if an input that needs it is used outside a FormField', () => {
    // React logs the thrown error; that's expected here.
    expect(() => render(<TestInput />)).toThrow('useFormFieldControl must be used inside a FormField.')
  })
})
