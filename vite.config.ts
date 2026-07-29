import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import content from "./src/config/content.json";

function contentMetadata(): Plugin {
  return {
    name: "content-metadata",
    transformIndexHtml() {
      return [
        {
          tag: "title",
          children: content.metadata.title,
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: {
            name: "description",
            content: content.metadata.description,
          },
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), contentMetadata()],
});
