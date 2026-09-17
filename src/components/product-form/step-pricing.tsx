import {
  formatDecimal,
  grossFromNet,
  netFromGross,
  parseDecimal,
} from '@/features/product-form/price'
import { pricingSchema } from '@/features/product-form/schema'
import { CURRENCY_OPTIONS, VAT_RATE_OPTIONS } from '@/features/products/dictionaries'

import { productFormOptions } from './product-form-options'
import { withForm } from './use-product-form'

/**
 * Krok 2 - Cena. Netto, brutto i VAT sa powiazane:
 * brutto = netto x (1 + VAT / 100). Edycja jednego pola przelicza drugie,
 * a zmiana VAT przelicza pole, ktorego uzytkownik NIE edytowal ostatnio.
 */
export const StepPricing = withForm({
  ...productFormOptions,
  render: function StepPricingRender({ form }) {
    // Przeliczone pole ustawiamy bez oznaczania go jako "dotkniete", zeby
    // komunikat bledu pojawial sie przy polu, ktore uzytkownik faktycznie edytuje.
    const setDerived = (name: 'netPrice' | 'grossPrice', value: number) => {
      form.setFieldValue(name, Number.isNaN(value) ? '' : formatDecimal(value), {
        dontUpdateMeta: true,
      })
    }

    const recalculate = (source: 'net' | 'gross', vatRate: number) => {
      if (source === 'net') {
        const net = parseDecimal(form.getFieldValue('netPrice'))
        setDerived('grossPrice', grossFromNet(net, vatRate))
      } else {
        const gross = parseDecimal(form.getFieldValue('grossPrice'))
        setDerived('netPrice', netFromGross(gross, vatRate))
      }
    }

    const currentVat = () => Number(form.getFieldValue('vatRate'))

    return (
      <>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <form.AppField
            name="netPrice"
            validators={{ onChange: pricingSchema.shape.netPrice }}
          >
            {(field) => (
              <field.TextField
                label="Cena netto"
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
                onValueChange={() => {
                  form.setFieldValue('priceSource', 'net', { dontUpdateMeta: true })
                  recalculate('net', currentVat())
                }}
              />
            )}
          </form.AppField>
          <form.AppField
            name="grossPrice"
            validators={{ onChange: pricingSchema.shape.grossPrice }}
          >
            {(field) => (
              <field.TextField
                label="Cena brutto"
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
                onValueChange={() => {
                  form.setFieldValue('priceSource', 'gross', { dontUpdateMeta: true })
                  recalculate('gross', currentVat())
                }}
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <form.AppField
            name="vatRate"
            validators={{ onChange: pricingSchema.shape.vatRate }}
          >
            {(field) => (
              <field.SelectField
                label="Stawka VAT"
                options={VAT_RATE_OPTIONS}
                onValueChange={(value) =>
                  recalculate(form.getFieldValue('priceSource'), Number(value))
                }
              />
            )}
          </form.AppField>
          <form.AppField
            name="currency"
            validators={{ onChange: pricingSchema.shape.currency }}
          >
            {(field) => <field.SelectField label="Waluta" options={CURRENCY_OPTIONS} />}
          </form.AppField>
        </div>
      </>
    )
  },
})
