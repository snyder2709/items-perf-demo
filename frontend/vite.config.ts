import vue from '@vitejs/plugin-vue';
// @ts-ignore
import Components from 'unplugin-vue-components/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  Components({
    dirs: ['src/shared/components',],
    extensions: ['vue'],
    deep: true,
    dts: 'src/types/components.d.ts',
  }),
  ],

  resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
})
