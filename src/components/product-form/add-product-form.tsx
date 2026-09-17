import { useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { productFormSchema, toProduct } from '@/features/product-form/schema'
import { PRODUCT_FORM_STEPS, type ProductFormStepIndex } from '@/features/product-form/steps'
import type { Product } from '@/features/products/types'

import { FormStepper } from './form-stepper'
import { productFormOptions } from './product-form-options'
import { StepAvailability } from './step-availability'
import { StepBasicInfo } from './step-basic-info'
import { StepPricing } from './step-pricing'
import { useAppForm } from './use-product-form'

type AddProductFormProps = {
  onSubmit: (product: Omit<Product, 'id'>) => void
}

const LAST_STEP = (PRODUCT_FORM_STEPS.length - 1) as ProductFormStepIndex

/**
 * Trzyetapowy formularz. Komponent jest montowany razem z otwarciem dialogu
 * i odmontowywany przy zamknieciu, wiec zamkniecie zawsze resetuje stan
 * (wartosci + krok).
 */
export function AddProductForm({ onSubmit }: AddProductFormProps) {
  const [step, setStep] = useState<ProductFormStepIndex>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const form = useAppForm({
    ...productFormOptions,
    validators: {
      onSubmit: productFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(toProduct(productFormSchema.parse(value)))
    },
  })

  const focusFirstControl = () => {
    requestAnimationFrame(() => {
      contentRef.current
        ?.querySelector<HTMLElement>('input, textarea, [role="combobox"]')
        ?.focus()
    })
  }

  /**
   * Waliduje wylacznie pola zamontowane w biezacym kroku (pola z innych krokow
   * sa odmontowane, ale ich wartosci zostaja w stanie formularza) i oznacza je
   * jako "dotkniete", zeby komunikaty bledow byly widoczne.
   */
  const validateCurrentStep = async () => {
    const errors = await form.validateAllFields('submit')
    return errors.length === 0
  }

  /** Dalej: przejscie tylko przy poprawnych danych biezacego kroku. */
  const goNext = async () => {
    if (!(await validateCurrentStep())) return
    setStep((current) => Math.min(current + 1, LAST_STEP) as ProductFormStepIndex)
    focusFirstControl()
  }

  /** Wstecz: bez walidacji, wartosci pol pozostaja w stanie formularza. */
  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0) as ProductFormStepIndex)
    focusFirstControl()
  }

  /** Zapisz: najpierw walidacja kroku 3, potem submit calego formularza. */
  const submit = async () => {
    if (!(await validateCurrentStep())) return
    await form.handleSubmit()
  }

  const isLastStep = step === LAST_STEP

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void (isLastStep ? submit() : goNext())
      }}
    >
      <div className="flex flex-col gap-4 px-4 pt-6 sm:gap-0 sm:p-0">
        <div className="flex items-start gap-2 sm:border-b sm:px-4 sm:py-6">
          <DialogTitle className="flex-1">Dodaj nowy produkt</DialogTitle>
          <DialogDescription className="sr-only">
            Formularz dodawania produktu w trzech krokach: informacje podstawowe, cena oraz
            dostępność i stany magazynowe.
          </DialogDescription>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="-m-1 size-6 rounded-xs text-foreground opacity-70 hover:bg-transparent hover:opacity-100 [&_svg]:size-4"
            >
              <XIcon aria-hidden />
              <span className="sr-only">Zamknij</span>
            </Button>
          </DialogClose>
        </div>
        <FormStepper currentStep={step} className="border-y py-6 sm:border-t-0 sm:px-4 sm:py-3" />
      </div>

      <div
        ref={contentRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:flex-initial sm:py-5"
      >
        {step === 0 && <StepBasicInfo form={form} />}
        {step === 1 && <StepPricing form={form} />}
        {step === 2 && <StepAvailability form={form} />}
      </div>

      <div className="flex items-center justify-between gap-2 border-t bg-muted/50 p-4">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={goBack}>
            <ArrowLeftIcon aria-hidden />
            Wstecz
          </Button>
        ) : (
          <span aria-hidden />
        )}

        {isLastStep ? (
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                Zapisz produkt
              </Button>
            )}
          </form.Subscribe>
        ) : (
          <Button type="submit">
            Dalej
            <ArrowRightIcon aria-hidden />
          </Button>
        )}
      </div>
    </form>
  )
}
