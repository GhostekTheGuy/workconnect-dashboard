import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { Product } from '@/features/products/types'

import { AddProductForm } from './add-product-form'

type AddProductDialogProps = {
  onProductAdd: (product: Omit<Product, 'id'>) => void
}

/**
 * Dialog "Dodaj produkt". Formularz zyje tylko wewnatrz otwartego dialogu -
 * zamkniecie (X, Escape, klik w tlo) odmontowuje go i resetuje do kroku 1.
 */
export function AddProductDialog({ onProductAdd }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon aria-hidden />
          Dodaj produkt
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-0 p-0 max-sm:inset-0 max-sm:h-dvh max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-[720px]"
        onOpenAutoFocus={(event) => {
          // Fokus na pierwszym polu zamiast na przycisku zamykania.
          const content = event.currentTarget
          const first =
            content instanceof HTMLElement
              ? content.querySelector<HTMLElement>('input, textarea')
              : null
          if (first) {
            event.preventDefault()
            first.focus()
          }
        }}
      >
        <AddProductForm
          onSubmit={(product) => {
            onProductAdd(product)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
