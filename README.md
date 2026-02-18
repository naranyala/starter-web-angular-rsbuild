# Angular Rsbuild Starter

A minimal Angular 19 application bundled with Rsbuild, running on the Bun runtime.

## Overview

This project demonstrates Angular 19 working with Rsbuild, a modern build tool based on Rspack. It provides faster build times compared to traditional Webpack-based Angular builds.

## Prerequisites

- [Bun](https://bun.sh/) v1.3 or later
- Node.js v18 or later (optional, for npm compatibility)

## Quick Start

### Install dependencies

```bash
bun install
```

### Development server

```bash
bun run dev
```

The application will be available at http://localhost:4200

### Production build

```bash
bun run build:rsbuild
```

Build output will be in `dist/angular-rsbuild-demo/`

### Traditional Angular CLI (Webpack)

This project also supports the standard Angular CLI commands:

```bash
bun run start    # Angular CLI dev server
bun run build    # Angular CLI production build
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Rsbuild development server with HMR |
| `bun run build:rsbuild` | Production build with Rsbuild |
| `bun run start` | Angular CLI dev server (Webpack) |
| `bun run build` | Angular CLI production build (Webpack) |
| `bun run test` | Run unit tests with Karma |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Run Biome linter with auto-fix |
| `bun run format` | Check code formatting with Biome |
| `bun run format:fix` | Format code with Biome |

## Project Structure

```
starter-angular-rsbuild/
├── src/
│   ├── app/                    # Application components
│   │   ├── app.component.ts    # Root component
│   │   ├── home/               # Home page component
│   │   └── demo/               # Demo page component
│   ├── main.ts                 # Application entry point
│   ├── index.html              # HTML template
│   ├── styles.css              # Global styles
│   └── assets/                 # Static assets
├── dist/                       # Build output
├── rsbuild.config.ts           # Rsbuild configuration
├── angular.json                # Angular CLI configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Configuration

### Rsbuild Configuration

The `rsbuild.config.ts` file configures the build process:

- Entry point: `src/main.ts`
- Output directory: `dist/angular-rsbuild-demo`
- Development server port: 4200
- HMR enabled for development
- SCSS and CSS support via plugins
- Static assets copied from `src/assets` and `src/favicon.ico`

### TypeScript Configuration

The project uses TypeScript 5.5 with the following key settings:

- Module: ES2022
- Module resolution: bundler
- Target: ES2022
- Experimental decorators enabled
- Strict mode enabled

### Angular Configuration

Components use inline templates and styles for compatibility with Rsbuild's JIT compilation mode.

## Key Dependencies

### Runtime

| Package | Version | Description |
|---------|---------|-------------|
| @angular/core | 19.2.x | Angular framework |
| @angular/router | 19.2.x | Angular router |
| @angular/forms | 19.2.x | Angular forms |
| rxjs | 7.8.x | Reactive extensions |
| zone.js | 0.15.x | Change detection |
| winbox | 0.2.x | Window management library |

### Development

| Package | Version | Description |
|---------|---------|-------------|
| @rsbuild/core | 1.7.x | Build tool |
| @rsbuild/plugin-sass | 1.5.x | SCSS support |
| @rsbuild/plugin-css-minimizer | 1.1.x | CSS optimization |
| typescript | 5.5.x | TypeScript compiler |
| @biomejs/biome | 2.4.x | Linter and formatter |

## Architecture Notes

### JIT Compilation

This project uses Angular's JIT (Just-in-Time) compilation mode for compatibility with Rsbuild. The Angular compiler is included in the bundle, which increases the bundle size but enables faster development builds.

For production optimization, consider switching to AOT (Ahead-of-Time) compilation with a custom build setup.

### Component Structure

All components use inline templates and styles instead of external files. This approach avoids issues with Angular's resource resolution in the Rsbuild bundler.

Example:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  template: '<div>Hello World</div>',
  styles: [`div { color: red; }`],
})
export class ExampleComponent {}
```

### Zone.js

Zone.js is required for Angular's change detection. It is imported in `src/main.ts`.

## Build Output

The production build generates:

- `index.html` - Main HTML file with injected scripts
- `favicon.ico` - Favicon copied from source
- `assets/` - Static assets folder
- `static/js/` - Bundled JavaScript files with content hashes

Typical bundle size: approximately 1.2 MB (includes Angular compiler and zone.js)

## Troubleshooting

### Port already in use

If port 4200 is in use, Rsbuild will automatically use the next available port (4201, 4202, etc.)

### Build fails after dependency changes

Clear the build cache and reinstall:

```bash
rm -rf dist node_modules
bun install
bun run build:rsbuild
```

### Module resolution errors

Ensure all imports use correct paths and file extensions. Rsbuild uses the TypeScript configuration for module resolution.

## Migration from Rspack

This project was migrated from direct Rspack configuration to Rsbuild. The key differences:

1. Rsbuild provides a higher-level configuration API
2. Built-in plugin system for SCSS, CSS, and other features
3. Simpler configuration file structure
4. Better defaults for modern frameworks

## License

Apache 2.0
