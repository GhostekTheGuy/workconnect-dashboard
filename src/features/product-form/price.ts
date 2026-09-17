/**
 * Przeliczanie cen (spec: brutto = netto x (1 + VAT / 100)).
 * Pola formularza trzymaja ceny jako tekst, zeby nie walczyc z kursorem
 * podczas wpisywania; parsowanie akceptuje przecinek i kropke.
 */

export function parseDecimal(raw: string): number {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.')
  if (normalized === '' || !/^-?\d*\.?\d*$/.test(normalized)) return Number.NaN
  return Number(normalized)
}

export function formatDecimal(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2)
}

export function grossFromNet(net: number, vatRate: number): number {
  return net * (1 + vatRate / 100)
}

export function netFromGross(gross: number, vatRate: number): number {
  return gross / (1 + vatRate / 100)
}
