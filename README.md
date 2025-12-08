## SneakerHub

SneakerHub to pełna aplikacja e-commerce w Next.js App Router, która łączy publiczną witrynę produktową z panelem użytkownika i zapleczem dla pracowników. Klienci przeglądają sneakersy i buty zimowe, dodają produkty do koszyka oraz składają zamówienia. Pracownicy zarządzają magazynem i zamówieniami bezpośrednio z przeglądarki.

<a href="https://sneaker-hub-peach.vercel.app/" target="_blank" rel="noopener noreferrer"><button type="button">Gotowa Strona</button></a>
---


### Wymagania

- Node.js ≥ 18
- npm / pnpm / yarn
- Dostępna baza danych PostgreSQL

### Kroki

1. **Zainstaluj zależności**
	```bash
	npm install
	```
2. **Skonfiguruj zmienne środowiskowe** – utwórz plik `.env` z wpisem:
	```bash
	DATABASE_URL="postgresql://user:password@host:port/database"
	```
3. **Zsynchronizuj Prisma**
	```bash
	npx prisma generate
	npx prisma db push
	```
4. **Uruchom serwer dev**
	```bash
	npm run dev
	```
5. **Lint (opcjonalnie)**: `npm run lint`

---

## Jak działa aplikacja

- **Landing i katalogi (`/`, `/buy`, `/sneakers`, `/winter`)** – produkty ładowane z API/Prisma. Wyświetlana liczba dostępnych par, przycisk “Add to Cart” jest blokowany, gdy stock <= 0.
- **Koszyk i konto (`/dashboard`)** – lokalny koszyk synchronizowany przez `localStorage`. Użytkownik widzi historię zamówień, aktualny koszyk i może złożyć nowe zamówienie (POST `/api/orders`).
- **Panel pracownika (`/worker`)** – weryfikacja roli `WORKER`. Formularz dodawania nowych produktów (nazwa, cena, kategoria, obraz, stock), tabela inwentarza z usuwaniem, lista zamówień z możliwością kasowania i modal „Create Order”.
- **API** – `/api/products` (GET/POST/DELETE) oraz `/api/orders` (GET/POST/DELETE) obsługują CRUD dla pracowników i klientów. `/api/auth/login` zwraca dane użytkownika i rolę, które są zapisywane w `localStorage`.

Flow użytkownika: rejestracja/logowanie → przegląd produktów → dodanie do koszyka → checkout → podgląd zamówień. Pracownik loguje się i przełącza zakładki „Products” / „Orders”.

---

## Struktura i kluczowe pliki

```
projekt/
├─ app/
│  ├─ layout.js             # globalny layout z <Header /> (nawigacja, BrandPattern)
│  ├─ page.js               # landing page
│  ├─ buy/page.js           # pełny katalog produktów
│  ├─ sneakers/page.js      # kolekcja sneakersów
│  ├─ winter/page.js        # kolekcja zimowa
│  ├─ dashboard/page.js     # konto użytkownika + koszyk
│  ├─ worker/page.js        # panel pracownika
│  └─ api/
│     ├─ auth/login/route.js   # logowanie
│     ├─ products/route.js     # CRUD produktów
│     └─ orders/route.js       # CRUD zamówień
├─ components/
│  └─ header.js            # nawigacja z obsługą ról i wylogowania
├─ lib/
│  ├─ prisma.js            # inicjalizacja Prisma Client
│  ├─ cartStorage.js       # logika koszyka + blokady stocku
│  └─ defaultProducts.js   # fallback produktów offline
├─ prisma/
│  └─ schema.prisma        # modele: User, Product, Order, OrderItem
└─ public/                 # grafiki (logo, sneakers/, winter/)
```

---

## Technologie i biblioteki

- **Next.js 13/14 App Router** (React 18, Turbopack w dev)
- **Prisma ORM 5.22** + **PostgreSQL**
- **ESLint** (`eslint-config-next/core-web-vitals`)
- **bcryptjs** (hashowanie haseł)
- **localStorage** (sesja użytkownika, koszyk)
- **Next/Image** (zdalne i lokalne obrazy produktów)

---

## Baza danych

1. Utwórz bazę PostgreSQL i ustaw `DATABASE_URL` w `.env`.
2. Modele w `prisma/schema.prisma` (relacje 1‑n i n‑1).
3. `npx prisma generate` – generuje klienta.
4. `npx prisma db push` – synchronizuje schemat z bazą.
5. Dodaj produkty startowe przez panel pracownika lub bezpośrednio API (`POST /api/products`).

---

