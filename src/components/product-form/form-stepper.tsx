import { CheckIcon } from 'lucide-react'

import { PRODUCT_FORM_STEPS, type ProductFormStepIndex } from '@/features/product-form/steps'
import { cn } from '@/lib/utils'

type FormStepperProps = {
  currentStep: ProductFormStepIndex
  className?: string
}

/**
 * Wskaznik krokow z Figmy: kolko 32px + tytul/opis, na desktopie polaczone
 * liniami, na mobile trzy kolumny (kolko nad etykieta).
 */
export function FormStepper({ currentStep, className }: FormStepperProps) {
  return (
    <ol
      aria-label="Kroki formularza"
      className={cn('flex items-start gap-4 sm:items-center', className)}
    >
      {PRODUCT_FORM_STEPS.map((step, index) => {
        const status =
          index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'
        const isLast = index === PRODUCT_FORM_STEPS.length - 1

        return (
          <li key={step.id} className="contents">
            <div
              aria-current={status === 'current' ? 'step' : undefined}
              className="flex min-w-0 flex-1 flex-col items-start gap-3 sm:flex-initial sm:flex-row sm:items-center"
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  status === 'upcoming'
                    ? 'border bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground',
                )}
              >
                {status === 'complete' ? (
                  <CheckIcon className="size-4" aria-hidden />
                ) : (
                  index + 1
                )}
                {status === 'complete' && <span className="sr-only">Ukończono</span>}
              </span>
              <span
                className={cn(
                  'flex min-w-0 flex-col gap-0.5 whitespace-nowrap',
                  status === 'upcoming' && 'text-muted-foreground',
                )}
              >
                <span className="text-sm font-medium leading-5">{step.title}</span>
                <span className="text-xs leading-4 text-muted-foreground">{step.description}</span>
              </span>
            </div>
            {!isLast && (
              <span
                aria-hidden
                className="hidden h-px min-w-4 flex-1 max-w-[67px] bg-border sm:block"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
