import type { ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface FormTextFieldProps<TFieldValues extends FieldValues>
  extends Omit<ComponentProps<typeof Input>, 'name' | 'defaultValue'> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  /** Merged with react-hook-form's own ref, e.g. for autofocus-on-mount. */
  fieldRef?: (el: HTMLInputElement | null) => void
}

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  fieldRef,
  ...inputProps
}: FormTextFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...inputProps}
              ref={(el) => {
                field.ref(el)
                fieldRef?.(el)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
