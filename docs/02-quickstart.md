# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Bun** v1.3.9 or higher
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

### Optional (for development)
- **Node.js** v18+ (for npm compatibility)
- **VS Code** with Biome extension
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd starter-web-angular-rsbuild
```

### 2. Install Dependencies

```bash
bun install
```

This will install:
- Angular 21.2.0 and all core dependencies
- Rsbuild and plugins
- Prism.js for syntax highlighting
- WinBox.js for window management
- Biome for linting and formatting

### 3. Verify Installation

```bash
bun --version
# Should output: 1.3.9 or higher

bun run dev
# Should start the development server
```

## Development Server

### Start Development Server

```bash
bun run dev
```

The server will:
- Start on `http://localhost:4200`
- Enable Hot Module Replacement (HMR)
- Watch for file changes
- Rebuild automatically

### Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```

You should see:
1. A welcome page with technology cards
2. A fixed top panel (currently empty until windows are opened)

### Using the Application

1. **Click a technology card** (Angular, Rsbuild, Bun, etc.)
2. A new WinBox window opens with:
   - Article header with icon and title
   - Overview section
   - Syntax-highlighted code example
   - Tips section
   - Footer with documentation link
3. The top panel now shows a tab for the window
4. Click the tab to focus the window
5. Use WinBox controls (minimize, maximize, close) in the window titlebar

## Building for Production

### Rsbuild Build

```bash
bun run build:rsbuild
```

Output:
- Location: `dist/angular-rsbuild-demo/`
- Bundle size: ~3.2 MB
- Build time: ~1-2 seconds

### Serve Production Build

```bash
cd dist/angular-rsbuild-demo
python3 -m http.server 4200
```

Or use any static file server:
```bash
bunx serve dist/angular-rsbuild-demo
```

### Angular CLI Build (Alternative)

For smaller production bundles:

```bash
bun run build
```

Output:
- Location: `dist/angular-rsbuild-demo/`
- Bundle size: ~865 KB
- Build time: ~20-25 seconds

## Project Structure

After installation, your project structure looks like:

```
starter-web-angular-rsbuild/
├── src/
│   ├── app/
│   │   ├── demo/
│   │   │   └── demo.component.ts      # Main demo component
│   │   ├── home/
│   │   │   └── home.component.ts      # Home page
│   │   └── shared/
│   │       ├── components/
│   │       │   └── window-tabs/       # Top panel component
│   │       └── services/
│   │           └── winbox-manager.ts  # Window management
│   ├── main.ts                        # App entry point
│   ├── index.html                     # HTML template
│   └── styles.css                     # Global styles
├── docs/                              # Documentation
├── rsbuild.config.ts                  # Rsbuild config
├── angular.json                       # Angular config
├── package.json                       # Dependencies
└── README.md                          # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build:rsbuild` | Production build with Rsbuild |
| `bun run serve:rsbuild` | Serve production build |
| `bun run start` | Angular CLI dev server |
| `bun run build` | Angular CLI production build |
| `bun run test` | Run unit tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Check linting (Biome) |
| `bun run lint:fix` | Auto-fix linting issues |
| `bun run format` | Check formatting |
| `bun run format:fix` | Format all files |

## Troubleshooting

### Port Already in Use

If port 4200 is already in use:

```bash
# Kill the process
pkill -f "rsbuild"
pkill -f "ng serve"

# Or use a different port
bun run dev --port 4201
```

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lock
bun install
```

### Build Errors

```bash
# Clean build
rm -rf dist
bun run build:rsbuild
```

### WinBox Not Loading

Ensure WinBox.js is loaded in `index.html`:

```html
<script src="winbox.bundle.min.js"></script>
```

## Next Steps

1. Read [Window Management](03-window-management.md) to understand WinBox.js integration
2. Read [Top Panel Design](04-top-panel.md) to customize the panel
3. Read [Content Layout](05-content-layout.md) to modify article structure
4. Read [Improvements](08-improvements.md) for enhancement ideas

## Getting Help

- Check the [documentation](docs/) for detailed guides
- Review [troubleshooting](09-troubleshooting.md) for common issues
- Create an issue on GitHub for bugs or feature requests
