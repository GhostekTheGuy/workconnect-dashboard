import type { Product } from '@/features/products/types'

/** Znak "pauzy" z projektu Figma dla produktow bez limitu magazynowego (U+2014). */
const NO_STOCK_PLACEHOLDER = '\u2014'

/** Stan magazynowy: liczba dla produktu limitowanego, w przeciwnym razie pauza. */
export function StockValue({ product }: { product: Product }) {
  return (
    <>{product.isLimited && product.stock !== null ? product.stock : NO_STOCK_PLACEHOLDER}</>
  )
}
