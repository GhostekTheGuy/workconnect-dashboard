import type { MouseEvent } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type ProductPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/** Buduje href zgodny z nuqs (strona 1 = brak parametru). */
function pageHref(page: number) {
  return page <= 1 ? '?' : `?page=${page}`
}

export function ProductPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: ProductPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  const go = (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onPageChange(target)
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={pageHref(page - 1)}
            disabled={page <= 1}
            onClick={go(page - 1)}
          />
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={pageHref(pageNumber)}
              isActive={pageNumber === page}
              onClick={go(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={pageHref(page + 1)}
            disabled={page >= totalPages}
            onClick={go(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
