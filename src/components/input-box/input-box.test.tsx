import { render, screen } from '@testing-library/react'
import type { FC } from 'react'
import { describe, expect, it } from 'vitest'
import { FormField, type FormFieldProps } from '../form-field/form-field'
import { useFormFieldControl } from '../form-field/form-field-context'
import { InputBox, inputBoxControlClassName, type InputBoxProps } from './input-box'

/** Minimal input that connects itself to the surrounding FormField. */
const TestInput: FC = () => <input className={inputBoxControlClassName} {...useFormFieldControl()} />

/** Renders an InputBox with {@link TestInput} inside a FormField, plus any props given. */
const renderBox = (boxProps: Omit<InputBoxProps, 'children'> = {}, fieldProps: Partial<FormFieldProps> = {}) => {
  const { container } = render(
    <FormField label="Name" {...fieldProps}>
      <InputBox {...boxProps}>
        <TestInput />
      </InputBox>
    </FormField>,
  )
  // The box is the input's parent element.
  const box = screen.getByRole('textbox', { name: 'Name' }).parentElement as HTMLElement
  return { container, box }
}

describe('InputBox', () => {
  it('shows the default border and hides icons from screen readers', () => {
    const { box } = renderBox({ iconLeft: 'Calendar', iconRight: 'ChevronDown' })
    expect(box).toHaveClass('border-input-border', 'bg-input-surface')
    const icons = box.querySelectorAll('svg')
    expect(icons).toHaveLength(2)
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'))
  })

  it('shows a red border and replaces the right icon with a hidden error icon', () => {
    const { box } = renderBox({ iconRight: 'ChevronDown' }, { error: 'Enter a name.' })
    expect(box).toHaveClass('border-input-border-error')
    const icons = box.querySelectorAll('svg')
    // Only the error icon, in the error color.
    expect(icons).toHaveLength(1)
    expect(icons[0]).toHaveAttribute('fill', 'var(--color-input-error-icon-surface)')
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the left icon while there is an error', () => {
    const { box } = renderBox({ iconLeft: 'Calendar' }, { error: 'Enter a name.' })
    // The left icon plus the error icon.
    expect(box.querySelectorAll('svg')).toHaveLength(2)
  })

  it('shows the disabled style instead of the error style', () => {
    const { box } = renderBox({}, { disabled: true, error: 'Enter a name.' })
    expect(box).toHaveClass('border-input-border-disabled', 'bg-input-surface-disabled')
    expect(box).not.toHaveClass('border-input-border-error')
    expect(box.querySelector('svg')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('keeps the left and right icons when disabled', () => {
    const { box } = renderBox({ iconLeft: 'Calendar', iconRight: 'ChevronDown' }, { disabled: true })
    expect(box.querySelectorAll('svg')).toHaveLength(2)
  })

  it('throws outside a FormField', () => {
    // React logs the thrown error; that's expected here.
    expect(() =>
      render(
        <InputBox>
          <input />
        </InputBox>,
      ),
    ).toThrow('useFormFieldControl must be used inside a FormField.')
  })
})
