import type { ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface FormTextareaFieldProps<TFieldValues extends FieldValues>
  extends Omit<ComponentProps<typeof Textarea>, 'name' | 'defaultValue'> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  /** Merged with react-hook-form's own ref, e.g. for autofocus-on-mount. */
  fieldRef?: (el: HTMLTextAreaElement | null) => void
}

export function FormTextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  fieldRef,
  ...textareaProps
}: FormTextareaFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              {...textareaProps}
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
