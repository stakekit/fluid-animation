import path from "path";
import { defineConfig } from "vite";
import packageJSON from "./package.json";

export default defineConfig({
  build: {
    lib: {
      formats: ["es"],
      name: "Fluid",
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJSON.dependencies),
        ...Object.keys(packageJSON.devDependencies),
      ],
    },
  },
});
