# 👟 SneakerHub

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Nowoczesny sklep internetowy z obuwiem sportowym i zimowym**

[🌐 Demo na żywo](https://sneaker-hub-peach.vercel.app/) • [📋 Funkcjonalności](#-funkcjonalności) • [🚀 Instalacja](#-instalacja)

</div>

---

## 📖 O projekcie

SneakerHub to kompletna aplikacja e-commerce zbudowana w **Next.js 16 App Router**. Łączy publiczną witrynę sklepową z panelem użytkownika oraz zapleczem administracyjnym dla pracowników.

### Dla kogo?

- **Klienci** — przeglądają katalog, dodają produkty do koszyka, składają zamówienia
- **Pracownicy** — zarządzają produktami, stanami magazynowymi i zamówieniami

---

## ✨ Funkcjonalności

### 🛒 Strefa klienta
| Funkcja | Opis |
|---------|------|
| Katalog produktów | Przeglądanie sneakersów i butów zimowych z filtrowaniem po kategorii |
| Koszyk | Dodawanie/usuwanie produktów, kontrola dostępności (stock) |
| System kont | Rejestracja, logowanie z bezpieczną sesją (httpOnly cookies) |
| Historia zamówień | Podgląd statusu i szczegółów wszystkich zamówień |
| Responsywny design | Pełna obsługa na urządzeniach mobilnych |

### 👷 Panel pracownika
| Funkcja | Opis |
|---------|------|
| Zarządzanie produktami | Dodawanie, edycja, usuwanie produktów |
| Kontrola stanów | Aktualizacja ilości w magazynie |
| Obsługa zamówień | Przeglądanie, tworzenie i anulowanie zamówień |
| Ręczne zamówienia | Modal do tworzenia zamówień dla klientów |

### 🔐 Bezpieczeństwo
- Hasła hashowane algorytmem **bcrypt**
- Sesje użytkowników w **httpOnly cookies** (niedostępne dla JavaScript)
- Walidacja ról (USER / WORKER)
- Ochrona endpointów API

---

## 🛠️ Stack technologiczny

| Warstwa | Technologie |
|---------|-------------|
| **Frontend** | Next.js 16, React 19, CSS Modules, Tailwind CSS 4 |
| **Backend** | Next.js API Routes (App Router) |
| **Baza danych** | PostgreSQL + Prisma ORM 5.22 |
| **Autentykacja** | bcryptjs, httpOnly cookies |
| **Deployment** | Vercel |

---

## 🚀 Instalacja

### Wymagania
- Node.js ≥ 18
- PostgreSQL (lokalnie lub w chmurze, np. Neon, Supabase)
- npm / pnpm / yarn

### Krok po kroku

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/kacper-olenkiewicz/sneakerhub.git
cd sneakerhub/projekt

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj zmienne środowiskowe
Utwórz plik .env i ustaw DATABASE_URL
```

```env
# .env
DATABASE_URL="postgresql://user:password@host:port/database"
```

```bash
# 4. Zainicjuj bazę danych
npx prisma generate
npx prisma db push

# 5. (Opcjonalnie) Dodaj konto admina
npx prisma db seed

# 6. Uruchom serwer deweloperski
npm run dev
```

Aplikacja dostępna pod: **http://localhost:3000**

---

## 📁 Struktura projektu

```
projekt/
├── app/
│   ├── layout.js                 # Główny layout z nawigacją
│   ├── page.js                   # Strona główna (landing)
│   ├── buy/                      # Pełny katalog produktów
│   ├── sneakers/                 # Kolekcja sneakersów
│   ├── winter/                   # Kolekcja zimowa
│   ├── login/                    # Logowanie
│   ├── register/                 # Rejestracja
│   ├── dashboard/                # Panel użytkownika + koszyk
│   ├── worker/                   # Panel pracownika
│   └── api/
│       ├── auth/
│       │   ├── login/            # POST - logowanie
│       │   ├── register/         # POST - rejestracja
│       │   └── session/          # GET/DELETE - sesja
│       ├── products/             # GET/POST/DELETE - produkty
│       └── orders/               # GET/POST/DELETE - zamówienia
├── components/
│   ├── header.js                 # Nawigacja z obsługą ról
│   ├── footer.js                 # Stopka
│   └── BrandPattern.js           # Dekoracyjny wzór
├── lib/
│   ├── prisma.js                 # Klient Prisma
│   ├── cartStorage.js            # Logika koszyka (localStorage)
│   └── defaultProducts.js        # Fallback dla trybu offline
├── prisma/
│   ├── schema.prisma             # Modele bazy danych
│   └── seed.js                   # Seeder (konto admin)
└── public/                       # Statyczne zasoby (logo, zdjęcia)
```

---

## 🗄️ Model bazy danych

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Order    │       │   Product   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │──┐    │ id          │    ┌──│ id          │
│ email       │  │    │ userId      │←───┘  │ name        │
│ name        │  └───→│ total       │       │ price       │
│ passwordHash│       │ status      │       │ category    │
│ role        │       │ createdAt   │       │ stock       │
│ createdAt   │       └──────┬──────┘       │ image       │
└─────────────┘              │              └──────┬──────┘
                             │                     │
                      ┌──────▼──────┐              │
                      │  OrderItem  │              │
                      ├─────────────┤              │
                      │ id          │              │
                      │ orderId     │←─────────────┘
                      │ productId   │
                      │ quantity    │
                      │ priceAtPurchase│
                      └─────────────┘
```

---

## 🔑 API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/auth/register` | Rejestracja nowego użytkownika |
| `POST` | `/api/auth/login` | Logowanie (ustawia httpOnly cookie) |
| `GET` | `/api/auth/session` | Pobierz dane zalogowanego użytkownika |
| `DELETE` | `/api/auth/session` | Wylogowanie |
| `GET` | `/api/products` | Lista wszystkich produktów |
| `POST` | `/api/products` | Dodaj produkt (wymaga roli WORKER) |
| `DELETE` | `/api/products?id=X` | Usuń produkt |
| `GET` | `/api/orders` | Lista zamówień (filtrowana po userId) |
| `POST` | `/api/orders` | Utwórz nowe zamówienie |
| `DELETE` | `/api/orders?id=X` | Usuń zamówienie |

---

## 👤 Domyślne konta

Po uruchomieniu seedera dostępne jest konto administratora:

| Email | Hasło | Rola |
|-------|-------|------|
| `admin@sneakerhub.com` | `admin` | WORKER |

---

## 📜 Skrypty npm

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchom serwer deweloperski |
| `npm run build` | Zbuduj aplikację produkcyjną |
| `npm run start` | Uruchom zbudowaną aplikację |
| `npm run lint` | Sprawdź kod ESLint |

---

## 🚢 Deployment

Aplikacja jest gotowa do wdrożenia na **Vercel**:

1. Połącz repozytorium z Vercel
2. Ustaw zmienną środowiskową `DATABASE_URL`
3. Deploy!

Alternatywnie możesz użyć Docker, Railway, Render lub dowolnej platformy wspierającej Next.js.

---

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik [LICENSE](LICENSE) po szczegóły.

---

<div align="center">

**Zbudowane z ❤️ przy użyciu Next.js i Prisma**

</div>

