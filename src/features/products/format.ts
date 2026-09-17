import type { CurrencyCode } from './dictionaries'

/** Format z Figmy: "9999,00 PLN" (przecinek dziesietny, bez separatora tysiecy). */
export function formatPrice(value: number, currency: CurrencyCode): string {
  return `${value.toFixed(2).replace('.', ',')} ${currency}`
}

/** Polska liczba mnoga: 1 produkt, 2 produkty, 5 produktow, 22 produkty, 112 produktow. */
export function pluralizeProducts(count: number): string {
  const abs = Math.abs(count)
  const lastDigit = abs % 10
  const lastTwo = abs % 100
  if (abs === 1) return `${count} produkt`
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
    return `${count} produkty`
  }
  return `${count} produktów`
}
