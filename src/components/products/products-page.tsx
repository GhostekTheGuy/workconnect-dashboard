import { useState } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { toast } from 'sonner'

import { AddProductDialog } from '@/components/product-form/add-product-dialog'
import { pluralizeProducts } from '@/features/products/format'
import { MOCK_PRODUCTS } from '@/features/products/mock-products'
import type { Product } from '@/features/products/types'

import { ProductCardList } from './product-card-list'
import { ProductTable } from './product-table'

const PAGE_SIZE = 5

const pageParser = parseAsInteger.withDefault(1).withOptions({ history: 'push' })

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [pageParam, setPageParam] = useQueryState('page', pageParser)

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  // URL moze wskazywac strone poza zakresem (np. po odswiezeniu) - pokazujemy najblizsza poprawna.
  const page = Math.min(Math.max(pageParam, 1), totalPages)
  const pageProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleProductAdd = (product: Omit<Product, 'id'>) => {
    setProducts((current) => [...current, { ...product, id: crypto.randomUUID() }])
    toast.success('Produkt został dodany')
  }

  const listProps = {
    products: pageProducts,
    totalCount: products.length,
    page,
    totalPages,
    onPageChange: (next: number) => void setPageParam(next),
  }

  return (
    <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-6 md:gap-6 md:px-8 md:py-[50px] xl:px-0">
      <header className="flex items-center justify-between gap-1 md:h-[52px]">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-xl font-semibold leading-7">Produkty</h1>
          <p className="text-sm text-muted-foreground">
            {pluralizeProducts(products.length)} w katalogu
          </p>
        </div>
        <AddProductDialog onProductAdd={handleProductAdd} />
      </header>

      <div className="hidden md:block">
        <ProductTable {...listProps} />
      </div>
      <div className="md:hidden">
        <ProductCardList {...listProps} />
      </div>
    </main>
  )
}
