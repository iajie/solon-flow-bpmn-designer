import {defineConfig} from "vite";
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        minify: "esbuild",
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'solon-flow-bpmn-designer',
            fileName: `index`,
            formats: ['es', 'cjs'],
        },
    },
    plugins: [dts({rollupTypes: true})],
    server: {
        port: 3008,
    }
});
