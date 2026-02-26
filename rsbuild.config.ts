import { defineConfig } from '@rsbuild/core';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import { pluginSass } from '@rsbuild/plugin-sass';

/**
 * Rsbuild configuration for Angular with Bun runtime
 *
 * Rsbuild is built on top of Rspack and provides a simpler configuration API
 * while maintaining compatibility with Angular's requirements.
 */
export default defineConfig({
  source: {
    entry: {
      index: './src/main.ts',
    },
    include: [/src/],
    define: {
      // Required for Angular to work properly
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
    dataUriLimit: {
      image: 4096,
      media: 4096,
    },
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
      // Enable Angular decorator support via TypeScript
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
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
  plugins: [pluginSass(), pluginCssMinimizer()],
});
