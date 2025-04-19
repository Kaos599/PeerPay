import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Emotion's automatic JSX import source for css prop
      jsxImportSource: '@emotion/react',
      // Enable Emotion Babel plugin for prop-based styling
      babel: {
        plugins: ['@emotion']
      }
    })
  ],
}) 