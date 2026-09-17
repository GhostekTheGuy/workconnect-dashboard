import { useId, type ComponentProps } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { isFieldInvalid, toFieldErrors } from './field-errors'
import { useFieldContext } from './form-context'

export type SelectOption<T extends string = string> = {
  value: T
  label: string
}

type BaseFieldProps = {
  label: string
  className?: string
}

/* ------------------------------ TextField ------------------------------ */

type TextFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur' | 'id'> & {
    /** Wywolywane po zapisaniu wartosci do formularza (np. do przeliczen cen). */
    onValueChange?: (value: string) => void
  }

export function TextField({
  label,
  className,
  onValueChange,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>()
  const id = useId()
  const invalid = isFieldInvalid(field.state.meta)

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value)
          onValueChange?.(event.target.value)
        }}
        aria-invalid={invalid}
        {...inputProps}
      />
      {invalid && <FieldError errors={toFieldErrors(field.state.meta)} />}
    </Field>
  )
}

/* ---------------------------- TextareaField ---------------------------- */

type TextareaFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur' | 'id'>

export function TextareaField({ label, className, ...textareaProps }: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const id = useId()
  const invalid = isFieldInvalid(field.state.meta)

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={invalid}
        {...textareaProps}
      />
      {invalid && <FieldError errors={toFieldErrors(field.state.meta)} />}
    </Field>
  )
}

/* ----------------------------- SelectField ----------------------------- */

type SelectFieldProps<T extends string> = BaseFieldProps & {
  placeholder?: string
  options: readonly SelectOption<T>[]
  onValueChange?: (value: T) => void
}

export function SelectField<T extends string>({
  label,
  className,
  placeholder,
  options,
  onValueChange,
}: SelectFieldProps<T>) {
  const field = useFieldContext<T | ''>()
  const id = useId()
  const invalid = isFieldInvalid(field.state.meta)

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value as T)
          onValueChange?.(value as T)
        }}
      >
        <SelectTrigger
          id={id}
          className="w-full"
          aria-invalid={invalid}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid && <FieldError errors={toFieldErrors(field.state.meta)} />}
    </Field>
  )
}

/* ------------------------- MultiSelectChipsField ------------------------ */

type MultiSelectChipsFieldProps<T extends string> = BaseFieldProps & {
  options: readonly SelectOption<T>[]
}

/** Multi-select w postaci chipow (Figma: "Cechy produktu"). */
export function MultiSelectChipsField<T extends string>({
  label,
  className,
  options,
}: MultiSelectChipsFieldProps<T>) {
  const field = useFieldContext<T[]>()
  const id = useId()
  const invalid = isFieldInvalid(field.state.meta)

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel id={id}>{label}</FieldLabel>
      <ToggleGroup
        type="multiple"
        variant="chip"
        size="chip"
        spacing={2}
        aria-labelledby={id}
        aria-invalid={invalid}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value as T[])}
        onBlur={field.handleBlur}
        className="justify-start"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {invalid && <FieldError errors={toFieldErrors(field.state.meta)} />}
    </Field>
  )
}

/* ----------------------------- SwitchField ----------------------------- */

export function SwitchField({ label, className }: BaseFieldProps) {
  const field = useFieldContext<boolean>()
  const id = useId()

  return (
    <Field orientation="horizontal" className={className}>
      <Switch
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      </FieldContent>
    </Field>
  )
}

/* ---------------------------- CheckboxField ---------------------------- */

type CheckboxFieldProps = BaseFieldProps & {
  onValueChange?: (checked: boolean) => void
}

export function CheckboxField({ label, className, onValueChange }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const id = useId()

  return (
    <Field orientation="horizontal" className={className}>
      <Checkbox
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          const value = checked === true
          field.handleChange(value)
          onValueChange?.(value)
        }}
        onBlur={field.handleBlur}
      />
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
    </Field>
  )
}
