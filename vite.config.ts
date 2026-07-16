import path from "path"
import react from "@vitejs/plugin-react"
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020', // Changed from es2015 to support BigInt
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'blockchain': ['@solana/web3.js', 'ethers'],
          'ui': ['framer-motion', 'lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
