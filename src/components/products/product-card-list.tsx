import { getCategoryLabel } from '@/features/products/dictionaries'
import { formatPrice, pluralizeProducts } from '@/features/products/format'
import type { Product } from '@/features/products/types'

import { AvailabilityBadge } from './availability-badge'
import { ProductPagination } from './product-pagination'
import { StockValue } from './stock-value'

type ProductCardListProps = {
  products: Product[]
  totalCount: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/** Widok mobilny (Figma 393px): lista kart + paginacja pod spodem. */
export function ProductCardList({
  products,
  totalCount,
  page,
  totalPages,
  onPageChange,
}: ProductCardListProps) {
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-2">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs text-muted-foreground">
          Strona {page} z {totalPages} · {pluralizeProducts(totalCount)}
        </p>
        <ProductPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col gap-2 rounded-[12px] border bg-card p-3">
      <div className="flex items-center gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate text-base font-medium leading-6">{product.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{product.sku}</p>
        </div>
        <AvailabilityBadge isAvailable={product.isAvailable} />
      </div>
      <dl className="grid grid-cols-3 gap-1 rounded-[9px] bg-muted p-3">
        <div className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Kategoria</dt>
          <dd className="truncate text-sm">{getCategoryLabel(product.category)}</dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Cena brutto</dt>
          <dd className="truncate text-sm font-medium">
            {formatPrice(product.grossPrice, product.currency)}
          </dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Magazyn</dt>
          <dd className="truncate text-sm">
            <StockValue product={product} />
          </dd>
        </div>
      </dl>
    </article>
  )
}
