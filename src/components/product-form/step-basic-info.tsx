import { basicInfoSchema } from '@/features/product-form/schema'
import { CATEGORIES, FEATURES, MANUFACTURERS } from '@/features/products/dictionaries'

import { productFormOptions } from './product-form-options'
import { withForm } from './use-product-form'

/** Krok 1 - Informacje podstawowe. */
export const StepBasicInfo = withForm({
  ...productFormOptions,
  render: function StepBasicInfoRender({ form }) {
    return (
      <>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <form.AppField
            name="name"
            validators={{ onChange: basicInfoSchema.shape.name }}
          >
            {(field) => (
              <field.TextField
                label="Nazwa produktu"
                placeholder="np. MacBook Pro 14"
                autoComplete="off"
              />
            )}
          </form.AppField>
          <form.AppField
            name="sku"
            validators={{ onChange: basicInfoSchema.shape.sku }}
          >
            {(field) => (
              <field.TextField
                label="SKU produktu"
                placeholder="np. MBP14M3PRO"
                autoComplete="off"
                maxLength={24}
              />
            )}
          </form.AppField>
        </div>

        <form.AppField name="description">
          {(field) => (
            <field.TextareaField label="Opis" placeholder="Krótki opis produktu" />
          )}
        </form.AppField>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <form.AppField
            name="manufacturer"
            validators={{ onChange: basicInfoSchema.shape.manufacturer }}
          >
            {(field) => (
              <field.SelectField
                label="Producent"
                placeholder="Wybierz producenta"
                options={MANUFACTURERS}
              />
            )}
          </form.AppField>
          <form.AppField
            name="category"
            validators={{ onChange: basicInfoSchema.shape.category }}
          >
            {(field) => (
              <field.SelectField
                label="Kategoria"
                placeholder="Wybierz kategorię"
                options={CATEGORIES}
              />
            )}
          </form.AppField>
        </div>

        <form.AppField
          name="features"
          validators={{ onChange: basicInfoSchema.shape.features }}
        >
          {(field) => (
            <field.MultiSelectChipsField label="Cechy produktu" options={FEATURES} />
          )}
        </form.AppField>
      </>
    )
  },
})
