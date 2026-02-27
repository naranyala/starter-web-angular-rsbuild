# Angular 21 + Rsbuild + WinBox.js Starter

A modern, high-performance Angular 21 application featuring a professional window management system with WinBox.js, bundled with Rsbuild and running on the Bun runtime.

![Angular](https://img.shields.io/badge/Angular-21.2.0-DD0031?style=flat&logo=angular)
![Rsbuild](https://img.shields.io/badge/Rsbuild-1.7.3-42B883?style=flat&logo=vite)
![Bun](https://img.shields.io/badge/Bun-1.3.9-FBF0DF?style=flat&logo=bun)
![Prism.js](https://img.shields.io/badge/Prism.js-1.30.0-F7DF1E?style=flat)
![WinBox.js](https://img.shields.io/badge/WinBox.js-0.2.82-007ACC?style=flat)

## 🌟 Features

### Window Management System
- **Fixed Top Panel** - Two-row collapsible panel for window management
  - Row 1: App title, window count, Home button
  - Row 2: Horizontal tab switcher for all open windows
- **WinBox.js Integration** - Professional window containers with:
  - Native titlebar controls (minimize, maximize, close)
  - Full-screen mode respecting top panel (88px offset)
  - Zero-margin layout for maximum content space
  - Dark theme with syntax-highlighted code blocks

### Content Display
- **Article Layout** - Professional content structure inside each window:
  - Header with icon, title, subtitle, and copy button
  - Overview section with description and documentation link
  - Code example section with Prism.js syntax highlighting
  - Key points section with tip cards
  - Footer with external links
- **Syntax Highlighting** - Prism.js with VS Code Dark+ theme
  - TypeScript/JavaScript support
  - Bundled from node_modules (offline-ready)
  - Copy-to-clipboard functionality

### Developer Experience
- **Hot Module Replacement** - Instant updates during development
- **Biome** - Fast linter and formatter (10x faster than ESLint)
- **TypeScript Strict Mode** - Full type safety
- **Inline Styles** - All component styles embedded for reliability

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server (port 4200)
bun run dev

# Build for production
bun run build:rsbuild

# Serve production build
cd dist/angular-rsbuild-demo && python3 -m http.server 4200
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

| Document | Description |
|----------|-------------|
| [01-overview.md](docs/01-overview.md) | Project overview and architecture |
| [02-quickstart.md](docs/02-quickstart.md) | Installation and setup guide |
| [03-window-management.md](docs/03-window-management.md) | WinBox.js window system |
| [04-top-panel.md](docs/04-top-panel.md) | Fixed top panel design |
| [05-content-layout.md](docs/05-content-layout.md) | Article layout and styling |
| [06-syntax-highlighting.md](docs/06-syntax-highlighting.md) | Prism.js integration |
| [07-build-system.md](docs/07-build-system.md) | Rsbuild configuration |
| [08-improvements.md](docs/08-improvements.md) | Future enhancement suggestions |

## 🏗️ Project Structure

```
starter-web-angular-rsbuild/
├── src/
│   ├── app/
│   │   ├── demo/
│   │   │   └── demo.component.ts      # Main demo with technology cards
│   │   ├── home/
│   │   │   └── home.component.ts      # Welcome page
│   │   └── shared/
│   │       ├── components/
│   │       │   └── window-tabs/       # Top panel component
│   │       └── services/
│   │           └── winbox-manager.service.ts  # Window management
│   ├── main.ts                        # App bootstrap with Prism.js
│   ├── index.html                     # HTML entry point
│   └── styles.css                     # Global styles
├── docs/                              # Documentation
├── rsbuild.config.ts                  # Rsbuild configuration
├── angular.json                       # Angular CLI config
├── package.json                       # Dependencies
└── README.md                          # This file
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
│  │    Platform for building web apps with TypeScript         │ │
│  │    ┌─────────────────────────────────────────────────┐   │ │
│  │    │ 🔗 Official Documentation                      │   │ │
│  │    │    https://angular.dev                         │   │ │
│  │    └─────────────────────────────────────────────────┘   │ │
│  │                                                           │ │
│  │ 💻 Example Usage                    [TypeScript]          │ │
│  │    ┌─────────────────────────────────────────────────┐   │ │
│  │    │ angular.ts                        [📋]          │   │ │
│  │    ├─────────────────────────────────────────────────┤   │ │
│  │    │ import { Component } from '@angular/core';      │   │ │
│  │    │ ...                                             │   │ │
│  │    └─────────────────────────────────────────────────┘   │ │
│  │                                                           │ │
│  │ 💡 Key Points                                              │ │
│  │    ┌──────────┐ ┌──────────┐ ┌──────────┐                │ │
│  │    │ ⚡        │ │ 🔒        │ │ 🧩        │                │ │
│  │    │Performance│ │Type Safety│ │ Modular   │                │ │
│  │    └──────────┘ └──────────┘ └──────────┘                │ │
│  │                                                           │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 🌐 Visit Angular Website ↗    Generated with Angular...  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Available Scripts

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

## 📦 Dependencies

### Core
- **@angular/core** ^21.2.0 - Latest Angular with signals and standalone components
- **rxjs** ~7.8.2 - Reactive extensions
- **zone.js** ~0.15.1 - Change detection
- **winbox** ^0.2.82 - Window management library
- **prismjs** ^1.30.0 - Syntax highlighting

### Development
- **@rsbuild/core** ^1.7.3 - Fast build tool
- **@biomejs/biome** ^2.4.4 - Linter and formatter
- **typescript** ~5.9.2 - Type safety
- **bun-types** ^1.3.9 - Bun runtime types

## ⚡ Performance Comparison

| Aspect | Rsbuild (Dev) | Angular CLI (Prod) |
|--------|---------------|-------------------|
| Build Time | ~1-2s | ~20-25s |
| Bundle Size | 3.2 MB | 865 KB |
| HMR | Instant | Fast |
| Optimization | Minimal | Full AOT |
| Use Case | Development | Production |

**Recommendation**: Use Rsbuild for development (fast iterations) and Angular CLI for production deployments (optimized bundles).

## 🎯 Key Design Decisions

### 1. Inline Styles for WinBox Content
All WinBox window content uses **inline `<style>` tags** instead of external CSS files. This ensures:
- No CSS loading delays
- No specificity conflicts
- Self-contained window content
- Reliable rendering

### 2. Two-Row Top Panel
- **Row 1**: App branding and global actions (Home button)
- **Row 2**: Window switcher (click to focus)
- Window controls (minimize/maximize/close) remain in WinBox titlebar

### 3. Prism.js from node_modules
- Bundled with the application (no CDN dependency)
- Works offline
- Version locked in package.json
- TypeScript types available

### 4. Maximized Windows
- Windows start at Y: 88px (below top panel)
- Height: viewport - 88px
- Zero margin for maximum content space
- Responsive to window resize

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

## 📝 License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Review [troubleshooting guide](docs/09-troubleshooting.md)

---

**Built with ❤️ using Angular 21, Rsbuild, and Bun**
