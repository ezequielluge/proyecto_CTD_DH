import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows access out of the container
    port: 5173,
    watch: {
      usePolling: true, // allows Hot reload in Docker
    },
  },
})
