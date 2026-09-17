import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCategoryLabel } from '@/features/products/dictionaries'
import { formatPrice, pluralizeProducts } from '@/features/products/format'
import type { Product } from '@/features/products/types'

import { AvailabilityBadge } from './availability-badge'
import { ProductPagination } from './product-pagination'
import { StockValue } from './stock-value'

type ProductTableProps = {
  products: Product[]
  totalCount: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/** Widok desktopowy (Figma "Table/lg"): tabela w karcie + stopka z paginacja. */
export function ProductTable({
  products,
  totalCount,
  page,
  totalPages,
  onPageChange,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[29%]">Nazwa</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Kategoria</TableHead>
            <TableHead>Cena Brutto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Magazyn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="max-w-0 truncate font-medium">{product.name}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{product.sku}</TableCell>
              <TableCell className="text-muted-foreground">
                {getCategoryLabel(product.category)}
              </TableCell>
              <TableCell className="font-medium">
                {formatPrice(product.grossPrice, product.currency)}
              </TableCell>
              <TableCell>
                <AvailabilityBadge isAvailable={product.isAvailable} />
              </TableCell>
              <TableCell>
                <StockValue product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-4 bg-gray-50 px-4 py-4">
        <p className="text-xs text-muted-foreground">
          Strona {page} z {totalPages} · {pluralizeProducts(totalCount)}
        </p>
        <ProductPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  )
}
