import type {
  CategoryId,
  CurrencyCode,
  FeatureId,
  ManufacturerId,
  VatRate,
} from './dictionaries'

export type Product = {
  id: string
  name: string
  sku: string
  description: string
  manufacturer: ManufacturerId
  category: CategoryId
  features: FeatureId[]
  netPrice: number
  grossPrice: number
  vatRate: VatRate
  currency: CurrencyCode
  isAvailable: boolean
  /** Produkt limitowany - gdy true, `stock` jest liczba; w przeciwnym razie null. */
  isLimited: boolean
  stock: number | null
  minCartQty: number
  maxCartQty: number
}
