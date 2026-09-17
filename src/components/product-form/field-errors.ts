import type { AnyFieldMeta } from '@tanstack/react-form'

/**
 * TanStack Form pozwala walidatorom zwracac zarowno stringi, jak i obiekty
 * (np. issues ze Standard Schema / Zod). Sprowadzamy je do ksztaltu,
 * ktorego oczekuje shadcn <FieldError errors={...} />.
 */
export function toFieldErrors(meta: AnyFieldMeta): Array<{ message?: string }> {
  return meta.errors.flatMap((error: unknown) => {
    if (!error) return []
    if (typeof error === 'string') return [{ message: error }]
    if (typeof error === 'object' && 'message' in error) {
      return [{ message: String((error as { message: unknown }).message) }]
    }
    return []
  })
}

export function isFieldInvalid(meta: AnyFieldMeta): boolean {
  return meta.isTouched && !meta.isValid
}
