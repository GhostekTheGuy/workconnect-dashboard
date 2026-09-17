import { formOptions } from '@tanstack/react-form'

import { defaultProductFormValues } from '@/features/product-form/schema'

export const productFormOptions = formOptions({
  defaultValues: defaultProductFormValues,
})
