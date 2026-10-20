# TasteMap

**Development of a platform for organizing events in the restaurant business**

TasteMap is a full-stack web platform that connects restaurant guests and venue owners. Guests discover venues by the conditions they care about and book a table online; owners publish their venue and manage incoming bookings in a personal dashboard. The project was developed as a diploma (graduation) work.

<!-- Add screenshots: docs/home.png, docs/restaurant.png, docs/profile.png, docs/dashboard.png -->

---

## Table of contents

1. [Problem and goal](#problem-and-goal)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Architecture](#architecture)
5. [Project structure](#project-structure)
6. [Data model](#data-model)
7. [REST API](#rest-api)
8. [Authentication and security](#authentication-and-security)
9. [Getting started](#getting-started)
10. [Configuration](#configuration)
11. [Frontend pages](#frontend-pages)
12. [Testing](#testing)
13. [Known limitations and roadmap](#known-limitations-and-roadmap)
14. [Author](#author)

---

## Problem and goal

Information about restaurants is scattered across social networks, maps and review sites. Booking is usually done by phone, so a guest cannot see the status of a request, and the venue tracks reservations in a notebook or spreadsheet. Finding a place by specific conditions (kids' area, pet-friendly, terrace, parking, Wi-Fi) is difficult.

**Goal:** build a single platform for searching venues, online table booking and reviews, with separate tools for venue owners.

## Features

**Guest (no registration)**
- Browse the restaurant catalog
- Filter by city, cuisine and amenities (case-insensitive, partial match)
- View a venue page: description, address, cuisine, capacity, amenities, reviews

**User (registered)**
- Registration with email verification by a one-time code
- Book a table: date, time, number of guests, comment
- View booking history with statuses and cancel own bookings
- Leave reviews with a 1–5 rating and a comment
- Save venues to favorites
- Personal profile with bookings and reviews

**Owner**
- Separate partner registration
- Create and edit the venue card: description, address, cuisine, tables, capacity, amenities
- Dashboard with all bookings of own venue (date, guests, comment, status)

## Technologies

| Layer | Stack |
|---|---|
| Backend | C#, ASP.NET Core 9 (REST API), Entity Framework Core 9 (Code First) |
| Database | PostgreSQL 16 (Npgsql provider) |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Security | JWT Bearer authentication, role-based authorization, BCrypt |
| Email | MailKit (SMTP) for verification codes |
| API docs | Swagger (Swashbuckle) |
| DevOps | Git, Docker, Docker Compose, Nginx |

## Architecture

The backend follows **Clean Architecture**. Dependencies point only inwards: the domain knows nothing about databases or web frameworks.

```
┌──────────────────────────────────────────────┐
│ TasteMap (Web API)                           │  controllers, JWT/CORS/Swagger setup,
│  ┌────────────────────────────────────────┐  │  dependency injection (Program.cs)
│  │ TasteMap.Infrastructure                │  │  AppDbContext, migrations,
│  │  ┌──────────────────────────────────┐  │  │  EmailService (MailKit)
│  │  │ TasteMap.Application             │  │  │  services, DTOs, interfaces
│  │  │  ┌────────────────────────────┐  │  │  │
│  │  │  │ TasteMap.Domain            │  │  │  │  entities
│  │  │  └────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

| Project | References | Responsibility |
|---|---|---|
| `TasteMap.Domain` | nothing | Entities: `User`, `Restaurant`, `Booking`, `Review`, `Event` |
| `TasteMap.Application` | Domain | Business logic (`AuthService`, `RestaurantService`, `BookingService`, `ReviewService`), DTOs, interfaces (`IAppDbContext`, `IEmailService`, ...) |
| `TasteMap.Infrastructure` | Application, Domain | `AppDbContext` (PostgreSQL), migrations, `EmailService` |
| `TasteMap` | all | HTTP layer: controllers, authentication, DI composition root |

**Why this way**
- Application declares interfaces, Infrastructure implements them, and `Program.cs` wires them together. The database or the mail provider can be replaced without touching business logic.
- Services can be tested with stubs instead of a real database or SMTP server.
- Controllers are thin: they read the user id from the JWT, call a service and return an HTTP response.
- New modules (for example events) are added as new service + controller + pages without changing existing code.

**Request flow (create a booking)**

```
React → POST /api/Booking/create (JWT)
      → BookingController → IBookingService → BookingService
      → IAppDbContext → AppDbContext (EF Core + Npgsql) → PostgreSQL
```

## Project structure

```
TasteMap/
├── TasteMap/                    # Web API (controllers, Program.cs, Dockerfile)
├── TasteMap.Application/        # services, DTOs, interfaces
├── TasteMap.Domain/             # entities
├── TasteMap.Infrastructure/     # DbContext, migrations, email service
├── tastemap-frontend/           # React + Vite client (Dockerfile, Nginx)
├── docker-compose.yml           # PostgreSQL + API + frontend
└── TasteMap.sln
```

## Data model

| Entity | Main fields |
|---|---|
| `User` | email, password hash, name, `Role` (default `User`), `IsEmailVerified`, verification code |
| `Restaurant` | name, description, address, city, cuisine, tables, capacity, amenities, `OwnerId` |
| `Booking` | date and time (stored in UTC), guests, comment, `Status` (`Pending` / `Confirmed` / `Cancelled`) |
| `Review` | rating 1–5, comment, author, restaurant |
| `Event` | title, description, date, price (model is ready, module is planned) |

Relations are one-to-many: a user has restaurants, bookings and reviews; a restaurant has bookings, reviews and events. Cascade deletion is restricted (`DeleteBehavior.Restrict`) where it could remove users or venues by accident. The schema is managed with EF Core migrations, which are applied automatically on API startup.

## REST API

Base path: `/api`. Interactive documentation is available in Swagger when the API runs in the Development environment.

### Auth
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/Auth/register` | Register, send verification code | public |
| POST | `/api/Auth/verify-email` | Confirm email with the code | public |
| POST | `/api/Auth/login` | Log in, receive JWT | public |

### Restaurant
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/Restaurant` | Catalog with filters (city, cuisine, amenities) | public |
| GET | `/api/Restaurant/{id}` | Venue details | public |
| POST | `/api/Restaurant/create` | Create a venue (`POST /api/Restaurant` is an alias) | owner |
| GET | `/api/Restaurant/my-restaurants` | Own venues (`my-restaurant` is kept for compatibility) | owner |

### Booking
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/Booking/create` | Create a booking (status `Pending`) | authorized |
| GET | `/api/Booking/my-bookings` | Own bookings | authorized |
| POST | `/api/Booking/cancel/{id}` | Cancel own booking | author only |
| GET | `/api/Booking/restaurant/{restaurantId}` | Bookings of a venue | venue owner |

### Review
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/Review/add` | Add a review (rating 1–5) | authorized |
| GET | `/api/Review/restaurant/{restaurantId}` | Reviews of a venue | public |
| GET | `/api/Review/my-reviews` | Own reviews | authorized |

## Authentication and security

1. Registration hashes the password with **BCrypt** (with salt).
2. The server generates a 6-digit code and sends it by email through **MailKit**.
3. The user submits the code; on success `IsEmailVerified` is set and the code is cleared.
4. Login returns a **JWT** (HMAC-SHA256, 2 hours) with user id, email and role claims.
5. The client stores the token and sends it as `Authorization: Bearer <token>`.
6. The server validates signature, issuer, audience and lifetime; endpoints are protected with `[Authorize]` and role checks.
7. Ownership is verified in services: an owner sees bookings only of own venues, a user cancels only own bookings.

CORS is restricted to the frontend origins (`http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`).

## Getting started

### Option 1: Docker Compose (recommended)

Requirements: Docker and Docker Compose.

```bash
git clone https://github.com/Artemikf/TasteMap.git
cd TasteMap
docker compose up -d --build
```

| Service | URL / port |
|---|---|
| Frontend (Nginx) | http://localhost:5173 |
| API | http://localhost:5068 |
| PostgreSQL | localhost:5432 |

Useful commands:

```bash
docker compose ps                  # status
docker compose logs -f backend     # API logs
docker compose down                # stop, keep data
docker compose down -v             # stop and delete database data
```

The API image is built from the solution root because the Dockerfile references all four projects (`context: .`, `dockerfile: TasteMap/Dockerfile`). Database data is stored in the named volume `postgres_data`.

### Option 2: Local development

Requirements: .NET SDK 9, Node.js 20+, PostgreSQL 16.

**Backend**
```bash
# set connection string and secrets (see Configuration)
dotnet run --project TasteMap
# API: http://localhost:5068 (see launchSettings.json), Swagger: /swagger
```
Migrations are applied automatically on startup. To apply them manually:
```bash
dotnet ef database update --project TasteMap.Infrastructure --startup-project TasteMap
```

**Frontend**
```bash
cd tastemap-frontend
npm install
npm run dev      # http://localhost:5173
```

## Configuration

Do not commit real secrets. Use environment variables, `dotnet user-secrets` or a `.env` file that is excluded from Git. In ASP.NET Core a double underscore maps to a nested key.

| Variable | Purpose |
|---|---|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `Jwt__Key` | JWT signing key (use at least 32 random characters) |
| `EmailSettings__SmtpServer`, `EmailSettings__SmtpPort` | SMTP server (default Outlook, port 587) |
| `EmailSettings__Password` | SMTP password or application password |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | PostgreSQL container settings |

Example for local run:
```bash
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=TasteMapDb;Username=postgres;Password=<password>"
export Jwt__Key="<long-random-secret>"
export EmailSettings__Password="<smtp-app-password>"
```

The frontend API address is defined in the Axios client (`http://localhost:5068/api` by default). Change it before deploying to a server.

## Frontend pages

| Route | Page |
|---|---|
| `/` | Home: catalog and filters |
| `/restaurant/:id` | Venue details, booking form, reviews |
| `/login`, `/register`, `/verify-email` | Authentication |
| `/register-partner` | Owner registration |
| `/profile` | User bookings and reviews |
| `/dashboard` | Owner dashboard |
| `/favorites` | Saved venues (stored in `localStorage`) |
| `/about`, `/how-it-works`, `/help`, `/partner-help`, `/privacy`, `/terms` | Information pages |
| `*` | 404 |

## Testing

Testing was performed manually through Swagger UI, the HTTP request file of the project and the browser. Checked scenarios include:

- registration with an already used email
- login with a wrong password (401)
- wrong email verification code
- booking without a token (401)
- creating a venue as a regular user (403)
- review rating outside 1–5
- combinations of catalog filters

## Known limitations and roadmap

**Limitations**
- No automated tests yet
- Booking confirmation by the owner is not implemented in the UI (the `Confirmed` status exists in the model)
- Favorites are stored in the browser and are not synchronized between devices
- No rate limiting or refresh tokens

**Roadmap**
- Events module (the `Event` entity is already in the database): event listing, sign-up, participants in the owner dashboard
- Booking confirmation by the owner
- Unit and integration tests (xUnit), CI/CD with security scanning
- Secrets via environment variables only, health checks and structured logging
- Venue photos, interactive map, refresh tokens, pagination
- Cloud deployment and a mobile client on the same API

## Author

**Artemikf** · [GitHub](https://github.com/Artemikf)

Diploma project, [University name], [year].
