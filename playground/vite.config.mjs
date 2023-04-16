// @ts-check
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { defineConfig } from 'vite'
import * as path from 'path'

export default defineConfig({
  base: '/playground/',
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
  ],
  resolve: {
    alias: [
      { find: /^bytemd\/dist\/(.*)$/, replacement: path.resolve(__dirname, '../packages/bytemd/dist/$1') },
      { find: /^bytemd$/, replacement: path.resolve(__dirname, '../packages/bytemd/src/index.ts') },
    ],
  },
})
