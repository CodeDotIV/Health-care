import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Copy index.html to 404.html so GitHub Pages serves the SPA on refresh/direct URLs */
function copy404Plugin() {
  return {
    name: 'copy-404',
    closeBundle() {
      const outDir = join(__dirname, 'dist')
      const indexPath = join(outDir, 'index.html')
      const notFoundPath = join(outDir, '404.html')
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, notFoundPath)
      }
    },
  }
}

// https://vite.dev/config/
// For GitHub Pages project site: https://<user>.github.io/Health-care/
export default defineConfig({
  base: '/Health-care/',
  plugins: [react(), copy404Plugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'react';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
