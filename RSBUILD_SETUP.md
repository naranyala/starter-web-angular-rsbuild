# Angular + Rsbuild + Bun Setup

This project demonstrates Angular 19 working with the Rsbuild build tool and Bun JavaScript runtime.

## Quick Start

### Development Server
```bash
bun run dev
# or
bun run serve:rsbuild
```

### Production Build
```bash
bun run build:rsbuild
```

### Traditional Angular CLI (Webpack)
```bash
bun run start    # Angular CLI dev server
bun run build    # Angular CLI production build
```

## Configuration Files

- `rsbuild.config.ts` - Rsbuild build configuration
- `bunfig.toml` - Bun runtime configuration
- `tsconfig.json` - TypeScript configuration for Angular 19

## Key Dependencies

- **Angular 19.2** - Latest Angular framework
- **Rsbuild 1.7** - Modern build tool based on Rspack
- **Bun 1.3** - Fast JavaScript runtime and package manager

## How It Works

This setup uses Rsbuild which:
1. Uses Rspack (Rust-based bundler) under the hood for fast builds
2. Provides a simpler configuration API than raw Rspack
3. Handles TypeScript, SCSS, and CSS natively via plugins
4. Generates HTML with built-in HTML plugin
5. Runs entirely on Bun runtime for maximum performance

## Notes

- The bundle size is large (~803KB) because it includes the full Angular runtime
- For production, consider enabling production mode and lazy loading
- HMR (Hot Module Replacement) works with `bun run dev`

## Troubleshooting

If you encounter issues:
1. Clean install: `rm -rf node_modules && bun install`
2. Clear cache: `rm -rf dist && bun run build:rsbuild`
3. Check Bun version: `bun --version` (should be 1.3+)
