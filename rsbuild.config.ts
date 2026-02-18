import { defineConfig } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';

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
  plugins: [
    pluginSass(),
    pluginCssMinimizer(),
  ],
});
