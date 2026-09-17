import { Separator } from '@/components/ui/separator'
import { parseDecimal } from '@/features/product-form/price'
import {
  availabilitySchema,
  MIN_MAX_MESSAGES,
  stockString,
} from '@/features/product-form/schema'

import { productFormOptions } from './product-form-options'
import { withForm } from './use-product-form'

const cartQtySchema = availabilitySchema.shape.minCartQty

/**
 * Walidacja pola limitu koszyka: najpierw regula pola (liczba calkowita >= 0),
 * potem regula krzyzowa min <= max. Zwraca jeden komunikat.
 */
function validateCartQty(
  value: string,
  other: string,
  kind: 'min' | 'max',
): string | undefined {
  const result = cartQtySchema.safeParse(value)
  if (!result.success) return result.error.issues[0]?.message

  const current = parseDecimal(value)
  const counterpart = parseDecimal(other)
  if (Number.isNaN(counterpart)) return undefined

  if (kind === 'min' && current > counterpart) return MIN_MAX_MESSAGES.minGreaterThanMax
  if (kind === 'max' && current < counterpart) return MIN_MAX_MESSAGES.maxLowerThanMin
  return undefined
}

/** Krok 3 - Dostepnosc i stany magazynowe. */
export const StepAvailability = withForm({
  ...productFormOptions,
  render: function StepAvailabilityRender({ form }) {
    return (
      <>
        <form.AppField name="isAvailable">
          {(field) => <field.SwitchField label="Produkt jest dostępny" />}
        </form.AppField>

        <Separator />

        <form.AppField name="isLimited">
          {(field) => <field.CheckboxField label="Produkt limitowany" />}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.isLimited}>
          {(isLimited) =>
            isLimited ? (
              <form.AppField name="stock" validators={{ onChange: stockString }}>
                {(field) => (
                  <field.TextField
                    label="Ilość na magazynie"
                    placeholder="np. 100"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                )}
              </form.AppField>
            ) : null
          }
        </form.Subscribe>

        <Separator />

        <h3 className="text-base font-medium leading-6">Limity koszyka</h3>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <form.AppField
            name="minCartQty"
            validators={{
              onChangeListenTo: ['maxCartQty'],
              onChange: ({ value, fieldApi }) =>
                validateCartQty(value, fieldApi.form.getFieldValue('maxCartQty'), 'min'),
            }}
          >
            {(field) => (
              <field.TextField
                label="Minimalna ilość"
                placeholder="1"
                inputMode="numeric"
                autoComplete="off"
              />
            )}
          </form.AppField>
          <form.AppField
            name="maxCartQty"
            validators={{
              onChangeListenTo: ['minCartQty'],
              onChange: ({ value, fieldApi }) =>
                validateCartQty(value, fieldApi.form.getFieldValue('minCartQty'), 'max'),
            }}
          >
            {(field) => (
              <field.TextField
                label="Maksymalna ilość"
                placeholder="10"
                inputMode="numeric"
                autoComplete="off"
              />
            )}
          </form.AppField>
        </div>
      </>
    )
  },
})
