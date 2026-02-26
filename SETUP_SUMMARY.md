# Setup Summary: Angular 21 + Biome Configuration

## What Was Done

### 1. Angular Framework Upgrade

Upgraded from Angular 19.2.x to **Angular 21.2.0** (latest stable as of February 2026):

```json
{
  "@angular/animations": "^21.2.0",
  "@angular/common": "^21.2.0",
  "@angular/compiler": "^21.2.0",
  "@angular/core": "^21.2.0",
  "@angular/forms": "^21.2.0",
  "@angular/platform-browser": "^21.2.0",
  "@angular/platform-browser-dynamic": "^21.2.0",
  "@angular/router": "^21.2.0",
  "@angular/ssr": "^21.2.0"
}
```

### 2. TypeScript Upgrade

Upgraded from TypeScript 5.5.x to **TypeScript 5.9.3** (required by Angular 21.2):

```json
{
  "typescript": "~5.9.2"
}
```

### 3. Biome Linter & Formatter Configuration

Enhanced `biome.json` with comprehensive Angular/TypeScript rules:

#### Key Features:
- **Schema version**: 2.4.4 (latest)
- **Formatting**: 2-space indent, 100 char line width, single quotes
- **TypeScript decorators**: Enabled for Angular compatibility
- **Smart overrides**:
  - Test files (`.spec.ts`, `.test.ts`): Relaxed `noExplicitAny` and `noUnusedVariables`
  - Component/Directive/Pipe files: Relaxed `noExplicitAny` for template bindings

#### Configuration Highlights:
```json
{
  "linter": {
    "rules": {
      "style": {
        "useConst": "error",
        "useImportType": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noAssignInExpressions": "error"
      },
      "correctness": {
        "noUnusedImports": "error",
        "useExhaustiveDependencies": "warn"
      }
    }
  }
}
```

### 4. Editor Configuration

Created `.vscode/settings.json` for seamless Biome integration:
- Format on save
- Auto-fix on save
- Import organization on save
- File exclusions for build artifacts

Created `.editorconfig` for consistent editor behavior across IDEs.

### 5. Test Updates

Updated tests to be compatible with Angular 21:
- Fixed routerLink attribute detection (changed from `ng-reflect-router-link` to support multiple attribute names)
- Updated version references from "Angular 19" to "Angular 21"

## Verification Results

### ✅ Lint
```bash
$ bun run lint
Checked 34 files in 160ms. No fixes applied.
```

### ✅ Format
```bash
$ bun run format
Checked 33 files in 98ms. No fixes applied.
```

### ✅ Tests
```bash
$ bun run test
85 pass
0 fail
141 expect() calls
```

### ✅ Rsbuild Build
```bash
$ bun run build:rsbuild
Total: 1267.0 kB (359.0 kB gzipped)
```

### ✅ Angular CLI Build
```bash
$ bun run build
Initial total: 865.41 kB (213.08 kB transfer size)
```

## Available Commands

```bash
# Development
bun run dev              # Rsbuild dev server with HMR
bun run start            # Angular CLI dev server

# Build
bun run build:rsbuild    # Production build with Rsbuild
bun run build            # Production build with Angular CLI

# Code Quality
bun run lint             # Check for lint errors
bun run lint:fix         # Auto-fix lint errors
bun run format           # Check formatting
bun run format:fix       # Format all files

# Tests
bun run test             # Run tests
bun run test:watch       # Watch mode
bun run test:coverage    # With coverage
```

## File Structure

```
starter-angular-rsbuild/
├── .vscode/
│   └── settings.json          # VSCode Biome integration
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── home/
│   │   ├── demo/
│   │   └── shared/
│   ├── main.ts
│   └── ...
├── biome.json                  # Biome configuration
├── .editorconfig               # Editor settings
├── .lintstagedrc.json          # Lint-staged config
├── rsbuild.config.ts
├── angular.json
├── tsconfig.json
└── package.json
```

## Biome VSCode Extension

**Required**: Install [Biome VSCode extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for:
- Real-time linting errors
- Format on save
- Code actions
- Import organization

## Notes

### TypeScript `any` Usage
The configuration allows `any` in specific cases:
- Test files (`.spec.ts`, `.test.ts`)
- Component templates (for event handlers like WinBox callbacks)
- Generic pipe transforms (e.g., `Record<string, any>`)
- Directive timeout IDs

This is a pragmatic approach that balances type safety with practical Angular development needs.

### Angular Version Compatibility
- Angular 21.2.0 requires TypeScript 5.9.x
- Zone.js 0.15.x is compatible
- RxJS 7.8.x is compatible

### Build Output Comparison

| Build Tool | Bundle Size | Gzip Size | Speed |
|------------|-------------|-----------|-------|
| Rsbuild    | 1267 kB     | 359 kB    | ~2s   |
| Angular CLI| 865 kB      | 213 kB    | ~22s  |

Rsbuild is significantly faster but produces larger bundles (includes Angular compiler for JIT).
Angular CLI uses AOT compilation resulting in smaller, more optimized bundles.

## Next Steps

For production deployment, consider:
1. Using Angular CLI build for smaller bundle sizes
2. Implementing lazy loading for routes
3. Adding bundle budget enforcement in `angular.json`
4. Setting up CI/CD with lint/format/test checks
