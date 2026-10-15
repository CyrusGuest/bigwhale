import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// relative asset URLs: the site is served both at a domain root and under a
// subpath (github.io/bigwhale), and hash routing keeps the path constant
export default defineConfig({
  base: './',
  plugins: [react()],
})
