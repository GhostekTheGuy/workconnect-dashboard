import { z } from 'zod'

import {
  CATEGORY_IDS,
  CURRENCIES,
  FEATURE_IDS,
  MANUFACTURER_IDS,
  VAT_RATE_VALUES,
  type CategoryId,
  type CurrencyCode,
  type FeatureId,
  type ManufacturerId,
  type VatRate,
  type VatRateValue,
} from '@/features/products/dictionaries'
import type { Product } from '@/features/products/types'

import { parseDecimal } from './price'

/**
 * Wartosci formularza. Pola liczbowe sa trzymane jako tekst (to, co wpisal
 * uzytkownik) i parsowane dopiero w walidacji / przy zapisie.
 */
export type ProductFormValues = {
  // Krok 1 - Informacje podstawowe
  name: string
  sku: string
  description: string
  manufacturer: ManufacturerId | ''
  category: CategoryId | ''
  features: FeatureId[]
  // Krok 2 - Cena
  netPrice: string
  grossPrice: string
  vatRate: VatRateValue
  currency: CurrencyCode
  /** Ktore pole cenowe uzytkownik edytowal ostatnio - zmiana VAT przelicza to drugie. */
  priceSource: 'net' | 'gross'
  // Krok 3 - Dostepnosc i stany magazynowe
  isAvailable: boolean
  isLimited: boolean
  stock: string
  minCartQty: string
  maxCartQty: string
}

export const defaultProductFormValues: ProductFormValues = {
  name: '',
  sku: '',
  description: '',
  manufacturer: '',
  category: '',
  features: [],
  netPrice: '',
  grossPrice: '',
  vatRate: '23',
  currency: 'PLN',
  priceSource: 'net',
  isAvailable: true,
  isLimited: false,
  stock: '',
  minCartQty: '1',
  maxCartQty: '10',
}

/* ----------------------------- pomocnicze ----------------------------- */

type NumberMessages = {
  required: string
  invalid: string
  negative: string
  integer?: string
}

/** Tekst reprezentujacy nieujemna liczbe (opcjonalnie calkowita). Zglasza tylko pierwszy blad. */
function numericString(messages: NumberMessages) {
  return z.string().superRefine((raw, ctx) => {
    if (raw.trim() === '') {
      ctx.addIssue({ code: 'custom', message: messages.required })
      return
    }
    const value = parseDecimal(raw)
    if (Number.isNaN(value)) {
      ctx.addIssue({ code: 'custom', message: messages.invalid })
      return
    }
    if (value < 0) {
      ctx.addIssue({ code: 'custom', message: messages.negative })
      return
    }
    if (messages.integer && !Number.isInteger(value)) {
      ctx.addIssue({ code: 'custom', message: messages.integer })
    }
  })
}

const priceString = numericString({
  required: 'Podaj cenę',
  invalid: 'Podaj poprawną liczbę',
  negative: 'Cena nie może być ujemna',
})

const cartQtyString = numericString({
  required: 'Podaj ilość',
  invalid: 'Podaj poprawną liczbę',
  negative: 'Ilość nie może być ujemna',
  integer: 'Ilość musi być liczbą całkowitą',
})

export const stockString = numericString({
  required: 'Podaj ilość na magazynie',
  invalid: 'Podaj poprawną liczbę',
  negative: 'Ilość nie może być ujemna',
  integer: 'Ilość musi być liczbą całkowitą',
})

/* ------------------------------- Krok 1 ------------------------------- */

export const basicInfoSchema = z.object({
  name: z.string().trim().min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
  sku: z
    .string()
    .trim()
    .min(1, { error: 'SKU jest wymagane', abort: true })
    .max(24, { error: 'SKU może mieć maksymalnie 24 znaki', abort: true })
    .regex(/^[\p{L}\p{Nd}]+$/u, 'SKU może zawierać tylko litery i cyfry'),
  description: z.string().trim(),
  manufacturer: z.enum(MANUFACTURER_IDS, { error: 'Wybierz producenta' }),
  category: z.enum(CATEGORY_IDS, { error: 'Wybierz kategorię' }),
  features: z
    .array(z.enum(FEATURE_IDS))
    .min(1, 'Wybierz co najmniej jedną cechę'),
})

/* ------------------------------- Krok 2 ------------------------------- */

export const pricingSchema = z.object({
  netPrice: priceString,
  grossPrice: priceString,
  vatRate: z.enum(VAT_RATE_VALUES, { error: 'Wybierz stawkę VAT' }),
  currency: z.enum(CURRENCIES, { error: 'Wybierz walutę' }),
  priceSource: z.enum(['net', 'gross']),
})

/* ------------------------------- Krok 3 ------------------------------- */

export const MIN_MAX_MESSAGES = {
  minGreaterThanMax: 'Minimalna ilość nie może być większa niż maksymalna',
  maxLowerThanMin: 'Maksymalna ilość nie może być mniejsza niż minimalna',
} as const

type AvailabilityValues = {
  isLimited: boolean
  stock: string
  minCartQty: string
  maxCartQty: string
}

/** Reguly miedzy polami kroku 3 (wspolne dla schematu kroku i schematu calosci). */
function refineAvailability(values: AvailabilityValues, ctx: z.RefinementCtx) {
  if (values.isLimited) {
    const result = stockString.safeParse(values.stock)
    for (const issue of result.error?.issues ?? []) {
      ctx.addIssue({ code: 'custom', path: ['stock'], message: issue.message })
    }
  }
  const min = parseDecimal(values.minCartQty)
  const max = parseDecimal(values.maxCartQty)
  if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
    ctx.addIssue({ code: 'custom', path: ['minCartQty'], message: MIN_MAX_MESSAGES.minGreaterThanMax })
    ctx.addIssue({ code: 'custom', path: ['maxCartQty'], message: MIN_MAX_MESSAGES.maxLowerThanMin })
  }
}

const availabilityShape = {
  isAvailable: z.boolean(),
  isLimited: z.boolean(),
  stock: z.string(),
  minCartQty: cartQtyString,
  maxCartQty: cartQtyString,
}

export const availabilitySchema = z.object(availabilityShape).superRefine(refineAvailability)

/* ------------------------------ Calosc -------------------------------- */

export const productFormSchema = z
  .object({
    ...basicInfoSchema.shape,
    ...pricingSchema.shape,
    ...availabilityShape,
  })
  .superRefine(refineAvailability)

export type ProductFormOutput = z.infer<typeof productFormSchema>

/** Mapuje zwalidowane wartosci formularza na produkt (bez id). */
export function toProduct(values: ProductFormOutput): Omit<Product, 'id'> {
  return {
    name: values.name,
    sku: values.sku,
    description: values.description,
    manufacturer: values.manufacturer,
    category: values.category,
    features: values.features,
    netPrice: parseDecimal(values.netPrice),
    grossPrice: parseDecimal(values.grossPrice),
    vatRate: Number(values.vatRate) as VatRate,
    currency: values.currency,
    isAvailable: values.isAvailable,
    isLimited: values.isLimited,
    stock: values.isLimited ? parseDecimal(values.stock) : null,
    minCartQty: parseDecimal(values.minCartQty),
    maxCartQty: parseDecimal(values.maxCartQty),
  }
}
