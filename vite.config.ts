<<<<<<< HEAD
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
=======
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb

export default defineConfig({
  server: {
    port: 3000,
<<<<<<< HEAD
    host: "0.0.0.0",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
=======
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
      alias: {
      '@': path.resolve(__dirname, '.'),
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb
    },
  },
});
