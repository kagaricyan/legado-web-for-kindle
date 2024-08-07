import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue';
// 536 616 kpw4 宽高
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vuePlugin()],
  css: {},
  build: {
    target: ['chrome53'],
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
  },
})
