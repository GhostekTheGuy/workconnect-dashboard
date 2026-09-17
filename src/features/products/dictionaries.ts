/** Predefiniowane listy wyboru (spec: Producent, Kategoria, Cechy, VAT, Waluta). */

export const MANUFACTURERS = [
  { value: 'apple', label: 'Apple' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'sony', label: 'Sony' },
  { value: 'bosch', label: 'Bosch' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'lg', label: 'LG' },
  { value: 'lenovo', label: 'Lenovo' },
] as const

export const CATEGORIES = [
  { value: 'komputery', label: 'Komputery' },
  { value: 'telefony', label: 'Telefony' },
  { value: 'rtv', label: 'RTV' },
  { value: 'agd', label: 'AGD' },
  { value: 'akcesoria', label: 'Akcesoria' },
] as const

export const FEATURES = [
  { value: 'bluetooth', label: 'Bluetooth' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'usb-c', label: 'USB-C' },
  { value: 'waterproof', label: 'Wodoodporny' },
  { value: 'wireless', label: 'Bezprzewodowy' },
  { value: 'eco', label: 'Ekologiczny' },
  { value: 'premium', label: 'Premium' },
] as const

export const VAT_RATES = [0, 5, 8, 23] as const

/** Opcje selecta VAT - Radix Select operuje na stringach. */
export const VAT_RATE_OPTIONS = VAT_RATES.map((rate) => ({
  value: String(rate) as `${VatRate}`,
  label: `${rate}%`,
}))

export const CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP'] as const

export const CURRENCY_OPTIONS = CURRENCIES.map((code) => ({
  value: code,
  label: code,
}))

export type ManufacturerId = (typeof MANUFACTURERS)[number]['value']
export type CategoryId = (typeof CATEGORIES)[number]['value']
export type FeatureId = (typeof FEATURES)[number]['value']
export type VatRate = (typeof VAT_RATES)[number]
export type VatRateValue = `${VatRate}`
export type CurrencyCode = (typeof CURRENCIES)[number]

export const MANUFACTURER_IDS = MANUFACTURERS.map((m) => m.value) as [
  ManufacturerId,
  ...ManufacturerId[],
]
export const CATEGORY_IDS = CATEGORIES.map((c) => c.value) as [
  CategoryId,
  ...CategoryId[],
]
export const FEATURE_IDS = FEATURES.map((f) => f.value) as [
  FeatureId,
  ...FeatureId[],
]
export const VAT_RATE_VALUES = VAT_RATES.map(String) as [
  VatRateValue,
  ...VatRateValue[],
]

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.value === id)?.label ?? id
}
