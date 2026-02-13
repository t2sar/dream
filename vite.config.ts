import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This ensures your existing code using process.env works in Vite
      'process.env': env
    },
    build: {
      outDir: 'dist',
    }
  };
});