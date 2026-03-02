import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/utilities/password-generator/",
  plugins: [react()],
  resolve: {
    alias: {
      $: path.resolve(__dirname, "./src"),
    },
  },
});
