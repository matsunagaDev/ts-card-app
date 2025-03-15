import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import env from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    react(),
    env({ prefix: 'VITE', mountedPath: 'process.env' }), // 環境変数プラグインを追加
  ],
  build: {
    outDir: 'dist',
  },
});
