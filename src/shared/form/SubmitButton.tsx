import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  isSubmitting: boolean
  label: string
  pendingLabel?: string
}

export function SubmitButton({
  isSubmitting,
  label,
  pendingLabel = 'Saving…',
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="violet"
      className="self-start"
      disabled={isSubmitting}
    >
      {isSubmitting ? pendingLabel : label}
    </Button>
  )
}
