import { defineConfig } from 'vite';
export default defineConfig({
  // relative asset paths so the build works when hosted from any sub-path
  base: './', server: { port: 5175 } });
