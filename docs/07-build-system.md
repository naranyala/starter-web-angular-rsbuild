# Build System with Rsbuild

## Overview

This project uses [Rsbuild](https://rsbuild.dev/) as the primary build tool. Rsbuild is a high-performance build tool built on Rspack, offering 10x faster builds than Webpack.

## Why Rsbuild?

| Aspect | Rsbuild | Angular CLI (Webpack) |
|--------|---------|----------------------|
| Build Time | ~1-2s | ~20-25s |
| HMR | Instant | Fast |
| Bundle Size | 3.2 MB | 865 KB |
| Configuration | Simple | Complex |
| Plugin System | Growing | Mature |

**Recommendation**: Use Rsbuild for development, Angular CLI for production.

## Configuration

### rsbuild.config.ts

```typescript
import { defineConfig } from '@rsbuild/core';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  source: {
    entry: {
      index: './src/main.ts',
    },
    include: [/src/],
    define: {
      ngDevMode: 'false',
      ngJitMode: 'undefined',
    },
  },
  output: {
    distPath: {
      root: './dist/angular-rsbuild-demo',
    },
    filename: {
      js: '[name].[contenthash].js',
    },
    cleanDistPath: true,
    copy: [
      { from: './src/favicon.ico' },
      { from: './src/assets', to: 'assets' },
      {
        from: './node_modules/winbox/dist/winbox.bundle.min.js',
        to: 'winbox.bundle.min.js',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.json'],
  },
  tools: {
    rspack: {
      optimization: {
        minimize: true,
      },
      experiments: {
        css: true,
      },
    },
  },
  html: {
    template: './src/index.html',
    inject: 'body',
  },
  dev: {
    hmr: true,
  },
  server: {
    port: 4200,
    historyApiFallback: true,
  },
  plugins: [pluginSass(), pluginCssMinimizer()],
});
```

## Key Configuration Options

### Source

```typescript
source: {
  entry: {
    index: './src/main.ts',  // Entry point
  },
  include: [/src/],  // Files to process
  define: {
    ngDevMode: 'false',     // Disable Angular dev mode
    ngJitMode: 'undefined', // Disable JIT
  },
}
```

### Output

```typescript
output: {
  distPath: {
    root: './dist/angular-rsbuild-demo',  // Output directory
  },
  filename: {
    js: '[name].[contenthash].js',  // Hash for cache busting
  },
  cleanDistPath: true,  // Clean before build
  copy: [
    // Copy static assets
    { from: './src/favicon.ico' },
    { from: './src/assets', to: 'assets' },
    {
      from: './node_modules/winbox/dist/winbox.bundle.min.js',
      to: 'winbox.bundle.min.js',
    },
  ],
}
```

### Resolve

```typescript
resolve: {
  extensions: ['.ts', '.js', '.mjs', '.json'],  // File extensions
}
```

### Development Server

```typescript
dev: {
  hmr: true,  // Hot Module Replacement
},
server: {
  port: 4200,              // Port
  historyApiFallback: true, // SPA routing
}
```

### Plugins

```typescript
plugins: [
  pluginSass(),           // SCSS support
  pluginCssMinimizer(),   // CSS minification
]
```

## Scripts

### package.json

```json
{
  "scripts": {
    "dev": "bun run rsbuild dev",
    "serve:rsbuild": "bun run rsbuild dev",
    "build:rsbuild": "bun run rsbuild build",
    "build": "ng build",
    "start": "ng serve"
  }
}
```

### Commands

```bash
# Development
bun run dev              # Start dev server
bun run serve:rsbuild    # Same as dev

# Production
bun run build:rsbuild    # Build with Rsbuild
bun run build            # Build with Angular CLI
```

## Build Output

### Development Build

```
dist/angular-rsbuild-demo/
├── index.html
├── favicon.ico
├── winbox.bundle.min.js
├── static/
│   ├── js/
│   │   ├── index.[hash].js    # Main bundle
│   │   └── vendors.[hash].js  # Vendor bundle
│   └── css/
│       └── index.[hash].css   # Styles
└── assets/
```

### Bundle Analysis

```
File                                    Size      Gzip
index.html                              0.80 kB   0.46 kB
favicon.ico                             0.95 kB   -
winbox.bundle.min.js                    16.0 kB   6.2 kB
static/js/index.[hash].js               47.8 kB   11.2 kB
static/js/vendors.[hash].js             3127.2 kB 604.9 kB
static/css/index.[hash].css             1.5 kB    0.59 kB
                                                       
Total:                                  3194.3 kB 624.3 kB
```

## Angular Compatibility

### Required Defines

```typescript
define: {
  ngDevMode: 'false',
  ngJitMode: 'undefined',
}
```

These are required for Angular to work properly with Rsbuild.

### Entry Point

```typescript
// src/main.ts
import '@angular/compiler';  // Required for template compilation
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## Hot Module Replacement

### How HMR Works

1. File changes detected
2. Rsbuild recompiles module
3. New code sent to browser
4. Angular updates component without reload

### HMR Configuration

```typescript
dev: {
  hmr: true,  // Enable HMR
}
```

### HMR Limitations

- Some Angular features may require full reload
- Services maintain state across HMR
- Route changes work normally

## Optimization

### Minification

```typescript
tools: {
  rspack: {
    optimization: {
      minimize: true,
    },
  },
},
plugins: [pluginCssMinimizer()],
```

### Tree Shaking

Rsbuild automatically removes unused code:

```typescript
// This unused code is removed
const unusedFunction = () => {};

// This code is kept
export function usedFunction() {}
```

### Code Splitting

```typescript
performance: {
  chunkSplit: {
    strategy: 'split-by-experience',
  },
}
```

## Asset Handling

### Copy Assets

```typescript
copy: [
  { from: './src/favicon.ico' },
  { from: './src/assets', to: 'assets' },
]
```

### Import Assets

```typescript
// In component
import logo from './logo.png';

// In template
<img [src]="logo" alt="Logo">
```

### URL Handling

```typescript
dataUriLimit: {
  image: 4096,   // Inline images < 4KB
  media: 4096,   // Inline media < 4KB
}
```

## Environment Variables

### Define Variables

```typescript
define: {
  'process.env.API_URL': JSON.stringify('https://api.example.com'),
}
```

### Use in Code

```typescript
const apiUrl = process.env.API_URL;
```

## Troubleshooting

### Build Fails with Angular Errors

**Problem**: Angular decorators not working

**Solution**: Ensure TypeScript config is correct:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

### HMR Not Working

**Problem**: Changes don't reflect without reload

**Solution**: Check HMR is enabled:

```typescript
dev: {
  hmr: true,
}
```

### Assets Not Copied

**Problem**: Static assets missing in dist

**Solution**: Check copy configuration:

```typescript
copy: [
  { from: './src/assets', to: 'assets' },
]
```

### Styles Not Applied

**Problem**: CSS not loading

**Solution**: Ensure CSS plugin is installed:

```bash
bun add -D @rsbuild/plugin-sass
```

```typescript
import { pluginSass } from '@rsbuild/plugin-sass';
plugins: [pluginSass()],
```

## Performance Tips

### 1. Use Development Build for Dev

```bash
bun run dev  # Fast builds
```

### 2. Use Angular CLI for Production

```bash
bun run build  # Optimized bundles
```

### 3. Enable Caching

```typescript
tools: {
  rspack: {
    cache: {
      type: 'filesystem',
    },
  },
}
```

### 4. Analyze Bundle

```bash
bunx webpack-bundle-analyzer dist/stats.json
```

## Migration from Angular CLI

### Step 1: Install Rsbuild

```bash
bun add -D @rsbuild/core @rsbuild/plugin-sass
```

### Step 2: Create Config

```typescript
// rsbuild.config.ts
export default defineConfig({
  // ... configuration
});
```

### Step 3: Update Scripts

```json
{
  "scripts": {
    "dev": "bun run rsbuild dev",
    "build:rsbuild": "bun run rsbuild build"
  }
}
```

### Step 4: Test

```bash
bun run dev  # Should work like ng serve
```

## Next Steps

1. Read [Improvements](08-improvements.md) for enhancement ideas
2. Check [Rsbuild Documentation](https://rsbuild.dev/) for advanced features
3. Explore [Rspack Plugins](https://rspack.dev/) for more functionality
