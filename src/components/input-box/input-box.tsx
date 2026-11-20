import type { FC, ReactNode } from 'react'
import { useFormFieldControl } from '../form-field/form-field-context'
import { Icon, type IconName } from '../icon/icon'

// TODO: Test on an iPhone once the form is built. iOS zooms in when an input's text is under 16px;
// if it does, use 16px text below `tablet` and 14px from `tablet` up (same issue as ShowSortSelect).
/**
 * Classes for the native control (`<input>`, `<select>`) inside an {@link InputBox}. The box draws
 * the border, background, and focus ring, so the control itself is borderless and transparent.
 * Written out in full so Tailwind can detect them.
 */
export const inputBoxControlClassName =
  'min-w-0 flex-1 bg-transparent text-sm leading-5 text-input-content outline-none placeholder:text-input-placeholder-content disabled:cursor-not-allowed disabled:text-input-content-disabled'

/** Size of the icons inside the box, matching the `input/size/icon` token (18px). */
const iconSize = 18

/** Props for {@link InputBox}. */
export interface InputBoxProps {
  /** Optional decorative icon before the control. */
  iconLeft?: IconName
  /** Optional decorative icon after the control. The error icon replaces it while there's an error. */
  iconRight?: IconName
  /** The native control, styled with {@link inputBoxControlClassName}. */
  children: ReactNode
}

/**
 * The 40px bordered box around a native control, shared by the text, number, password, date, and
 * select inputs. It must sit inside a {@link FormField}, which tells it whether the field is
 * disabled or has an error.
 *
 * States:
 * - Focused: a blue ring around the box while the control inside has keyboard focus (text
 *   inputs show it on click too, since typing needs the keyboard).
 * - Error: red border, and a red exclamation circle icon in place of `iconRight`.
 * - Disabled: grey background, border, and text.
 *
 * Accessibility: all icons, including the error icon, are hidden from screen readers. The control's
 * `aria-invalid` and the field's error message already tell them about the error; the red border
 * and icon are the visual equivalent, so the error isn't shown by color alone.
 *
 * @param props - See {@link InputBoxProps}.
 * @returns The box element with the control inside.
 */
export const InputBox: FC<InputBoxProps> = ({ iconLeft, iconRight, children }) => {
  // FormField never marks a disabled field invalid, so these two never clash.
  const { 'aria-invalid': invalid, disabled } = useFormFieldControl()

  let stateClassName = 'border-input-border bg-input-surface'
  if (disabled) {
    stateClassName = 'border-input-border-disabled bg-input-surface-disabled'
  } else if (invalid) {
    stateClassName = 'border-input-border-error bg-input-surface'
  }

  return (
    <div
      className={`flex h-input-size-field-height items-center gap-input-spacing-content rounded-input-radius-field border-(length:--input-border-width) px-input-spacing-field-horizontal has-[:focus-visible]:outline-(length:--input-focus-ring-width) has-[:focus-visible]:outline-offset-(length:--input-focus-ring-offset) has-[:focus-visible]:outline-input-focus-ring-color ${stateClassName}`}
    >
      {iconLeft && <Icon name={iconLeft} size={iconSize} color="var(--color-input-icon-content)" />}
      {children}
      {/* TODO: In Figma, set `input/error-icon/content` to red/700 and delete `input/error-icon/surface`
          (the icon has one color now), then use `--color-input-error-icon-content` here. */}
      {invalid ? (
        <Icon name="ExclamationCircle" size={iconSize} color="var(--color-input-error-icon-surface)" />
      ) : (
        iconRight && <Icon name={iconRight} size={iconSize} color="var(--color-input-icon-content)" />
      )}
    </div>
  )
}
