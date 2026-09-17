# WorkConnect - formularz dodawania produktu

Trzyetapowy formularz dodawania produktu w dialogu oraz tabela produktów z paginacją w URL.

## Stack

React 19, TypeScript, Vite, shadcn/ui, Tailwind CSS v4, TanStack Form, Zod, nuqs, Sonner.

## Uruchomienie

Node.js 20.19+ lub 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build produkcyjny do ./dist
```

## Struktura

```
src/
  components/ui/            komponenty shadcn/ui dostosowane do designu
  components/products/      tabela, karty mobilne, paginacja, strona
  components/product-form/  dialog, kroki formularza, komponenty pól
  features/products/        typy, słowniki, dane mockowe
  features/product-form/    schematy Zod, przeliczanie cen
```

## Uwagi

- Dane produktów są tylko w pamięci; odświeżenie przywraca 7 produktów startowych.
- Etykieta pola opisu w Figmie ma treść "Nazwa produktu"; zgodnie ze specyfikacją użyto "Opis".
