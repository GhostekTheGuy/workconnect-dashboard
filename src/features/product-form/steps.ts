export const PRODUCT_FORM_STEPS = [
  { id: 'basic-info', title: 'Informacje', description: 'Dane podstawowe' },
  { id: 'pricing', title: 'Cena', description: 'Dane cenowe' },
  { id: 'availability', title: 'Dostępność', description: 'Stany magazynowe' },
] as const

export type ProductFormStepIndex = 0 | 1 | 2
