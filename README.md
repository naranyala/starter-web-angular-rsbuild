# Starter Web: Angular + Rsbuild & Hono.js + Drizzle

A modern full-stack web application starter combining **Angular 21** with **Rsbuild** for the frontend, and **Hono.js** with **Drizzle ORM** for the backend, all running on the **Bun** runtime.

![Angular](https://img.shields.io/badge/Angular-21.2.0-DD0031?style=flat&logo=angular)
![Rsbuild](https://img.shields.io/badge/Rsbuild-1.7.3-42B883?style=flat)
![Hono](https://img.shields.io/badge/Hono-4.12.3-E36002?style=flat&logo=hono)
![Drizzle](https://img.shields.io/badge/Drizzle-0.45.1-C5F74F?style=flat&logo=drizzle)
![Bun](https://img.shields.io/badge/Bun-1.3.9-FBF0DF?style=flat&logo=bun)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)

## 🌟 Features

### Frontend (Angular + Rsbuild)
- ⚡ **Rsbuild** - Lightning-fast build tool with HMR (~1-2s builds)
- 🪟 **WinBox.js Window System** - Professional window management with draggable, resizable windows
- 🎨 **Fixed Top Panel** - Two-row collapsible panel for window switching and app controls
- 📝 **Prism.js Syntax Highlighting** - VS Code Dark+ theme for code blocks
- 🧪 **Biome** - 10x faster linting and formatting (ESLint alternative)
- 📦 **Standalone Components** - Modern Angular architecture with signals

### Backend (Hono.js + Drizzle)
- 🚀 **Hono.js** - Ultra-fast, lightweight REST API framework
- 🗄️ **Drizzle ORM** - Type-safe database operations with SQLite
- 🏗️ **Clean Architecture** - Controllers → Services → Repositories pattern
- 💉 **Dependency Injection** - Modular, testable service container
- 🔥 **Hot Reload** - Instant server restarts with `bun run --hot`
- 📜 **Database Migrations** - Schema versioning with Drizzle Kit

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Port 4200)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Angular 21 + Rsbuild                                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   Home      │  │   Demo      │  │  Window System  │   │  │
│  │  │ Component   │  │ Component   │  │  (WinBox.js)    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (Port 3000)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Hono.js + Drizzle ORM                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Controllers│─▶│ Services │─▶│Repos     │─▶│  SQLite  │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  │       ▲                                              │     │  │
│  │       └────────── DI Container ──────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
starter-web-angular-rsbuild/
├── frontend/                    # Angular 21 + Rsbuild application
│   ├── src/
│   │   ├── app/
│   │   │   ├── demo/           # Demo component with technology cards
│   │   │   ├── home/           # Welcome page
│   │   │   └── shared/         # Shared components & services
│   │   │       ├── components/
│   │   │       │   └── window-tabs/   # Top panel window manager
│   │   │       └── services/
│   │   │           └── winbox-manager.service.ts
│   │   ├── main.ts             # App bootstrap with Prism.js
│   │   ├── index.html          # HTML entry point
│   │   └── styles.css          # Global styles
│   ├── docs/                   # Frontend documentation
│   ├── rsbuild.config.ts       # Rsbuild configuration
│   ├── angular.json            # Angular CLI config
│   ├── biome.json              # Biome linter config
│   └── package.json
│
├── backend/                    # Hono.js + Drizzle API server
│   ├── src/
│   │   ├── container/          # Dependency Injection
│   │   │   ├── container.ts    # DI container implementation
│   │   │   └── di-container.ts # Service bindings
│   │   ├── controllers/        # HTTP request handlers
│   │   ├── services/           # Business logic layer
│   │   ├── repositories/       # Data access layer
│   │   ├── routes/             # Route definitions
│   │   ├── db/                 # Database configuration
│   │   │   ├── index.ts        # DB connection & types
│   │   │   └── schema.ts       # Drizzle schema
│   │   └── types/              # TypeScript types
│   ├── drizzle/                # Migration files
│   ├── drizzle.config.ts       # Drizzle Kit config
│   ├── index.ts                # Server entry point
│   └── package.json
│
├── README.md                   # This file
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3.9
- Node.js >= 20 (optional, Bun includes Node-compatible runtime)

### Installation

```bash
# Install frontend dependencies
cd frontend
bun install

# Install backend dependencies
cd ../backend
bun install
```

### Running the Application

#### Terminal 1: Start Backend

```bash
cd backend
bun run dev
```

Backend runs on `http://localhost:3000`

#### Terminal 2: Start Frontend

```bash
cd frontend
bun run dev
```

Frontend runs on `http://localhost:4200`

### Production Build

```bash
# Build frontend for production
cd frontend
bun run build:rsbuild

# Serve production build
cd dist/angular-rspack-demo
python3 -m http.server 4200

# Start backend in production mode
cd backend
bun run start
```

## 📚 Documentation

### Frontend Documentation
Detailed documentation is available in [`frontend/docs/`](frontend/docs/):

| Document | Description |
|----------|-------------|
| [01-overview.md](frontend/docs/01-overview.md) | Project overview and architecture |
| [02-quickstart.md](frontend/docs/02-quickstart.md) | Installation and setup guide |
| [03-window-management.md](frontend/docs/03-window-management.md) | WinBox.js window system |
| [04-top-panel.md](frontend/docs/04-top-panel.md) | Fixed top panel design |
| [05-content-layout.md](frontend/docs/05-content-layout.md) | Article layout and styling |
| [06-syntax-highlighting.md](frontend/docs/06-syntax-highlighting.md) | Prism.js integration |
| [07-build-system.md](frontend/docs/07-build-system.md) | Rsbuild configuration |
| [08-improvements.md](frontend/docs/08-improvements.md) | Future enhancements |

### Backend Documentation
See [`backend/README.md`](backend/README.md) for detailed backend documentation.

## 🔧 Available Commands

### Frontend

| Command | Description |
|---------|-------------|
| `bun run dev` | Rsbuild dev server with HMR (port 4200) |
| `bun run build:rsbuild` | Production build with Rsbuild |
| `bun run serve:rsbuild` | Serve production build locally |
| `bun run start` | Angular CLI dev server (Webpack) |
| `bun run build` | Angular CLI production build |
| `bun run test` | Run unit tests with Bun |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Check for lint errors (Biome) |
| `bun run lint:fix` | Auto-fix lint errors |
| `bun run format` | Check code formatting |
| `bun run format:fix` | Format all files |

### Backend

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload (port 3000) |
| `bun run start` | Start production server |
| `bun run db:generate` | Generate migrations after schema changes |
| `bun run db:migrate` | Apply migrations to database |
| `bun run db:studio` | Open Drizzle Studio (database GUI) |

## 🌐 API Endpoints

| Method | Endpoint        | Description       |
|--------|-----------------|-------------------|
| GET    | `/`             | Health check      |
| GET    | `/api/users`    | List all users    |
| GET    | `/api/users/:id`| Get user by ID    |
| POST   | `/api/users`    | Create user       |
| PUT    | `/api/users/:id`| Update user       |
| DELETE | `/api/users/:id`| Delete user       |

### Example API Requests

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ 🪟 Window Manager    [3] Windows • [1] Minimized    [🏠 Home]  │ ← Row 1 (44px)
├─────────────────────────────────────────────────────────────────┤
│ [🅰️ Angular] [⚡ Rsbuild] [📘 TypeScript] [🚀 esbuild] [🔥 HMR] │ ← Row 2 (44px)
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🅰️  Angular                        [📋 Copy Code]         │ │
│  │     Platform for building web apps                        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 📖 Overview                                                │ │
│  │    ┌─────────────────────────────────────────────────┐   │ │
│  │    │ 🔗 Official Documentation                      │   │ │
│  │    │    https://angular.dev                         │   │ │
│  │    └─────────────────────────────────────────────────┘   │ │
│  │                                                           │ │
│  │ 💻 Example Usage                    [TypeScript]          │ │
│  │    ┌─────────────────────────────────────────────────┐   │ │
│  │    │ import { Component } from '@angular/core';      │   │ │
│  │    │ ...                                             │   │ │
│  │    └─────────────────────────────────────────────────┘   │ │
│  │                                                           │ │
│  │ 💡 Key Points                                              │ │
│  │    ┌──────────┐ ┌──────────┐ ┌──────────┐                │ │
│  │    │ ⚡        │ │ 🔒        │ │ 🧩        │                │ │
│  │    │Performance│ │Type Safety│ │ Modular   │                │ │
│  │    └──────────┘ └──────────┘ └──────────┘                │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## ⚡ Performance Comparison

### Frontend Build Tools

| Aspect | Rsbuild (Dev) | Angular CLI (Prod) |
|--------|---------------|-------------------|
| Build Time | ~1-2s | ~20-25s |
| Bundle Size | 3.2 MB | 865 KB |
| HMR | Instant | Fast |
| Optimization | Minimal | Full AOT |
| Use Case | Development | Production |

**Recommendation**: Use Rsbuild for development (fast iterations) and Angular CLI for production deployments (optimized bundles).

## 🛠️ Adding New Features

### Backend: New Feature Template

1. **Create Schema** (`backend/src/db/schema.ts`)
2. **Create Repository** (`backend/src/repositories/`)
3. **Create Service** (`backend/src/services/`)
4. **Create Controller** (`backend/src/controllers/`)
5. **Register in DI Container** (`backend/src/container/di-container.ts`)
6. **Add Routes** (`backend/src/routes/`)
7. **Wire in App** (`backend/src/app.ts`)

See [backend/README.md](backend/README.md) for detailed examples.

### Frontend: New Component

1. **Generate Component** (or create manually in `frontend/src/app/`)
2. **Add to Routes** (if needed)
3. **Register in Window System** (for WinBox.js integration)
4. **Add Styles** (inline or global)

See [frontend/docs/](frontend/docs/) for detailed examples.

## 📦 Dependencies

### Frontend Core
- **@angular/core** ^21.2.0
- **rxjs** ~7.8.2
- **zone.js** ~0.15.1
- **winbox** ^0.2.82
- **prismjs** ^1.30.0

### Frontend Dev
- **@rsbuild/core** ^1.7.3
- **@biomejs/biome** ^2.4.4
- **typescript** ~5.9.2

### Backend Core
- **hono** ^4.12.3
- **drizzle-orm** ^0.45.1
- **drizzle-kit** ^0.31.9

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check the [frontend documentation](frontend/docs/)
- Review [backend README](backend/README.md)

---

**Built with ❤️ using Angular 21, Rsbuild, Hono.js, Drizzle ORM, and Bun**
