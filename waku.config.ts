import { cloudflare } from "@cloudflare/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "waku/config";
import path from "path";
import { fileURLToPath } from "url";
import { generateSEOFiles } from "./scripts/generate-seo-files.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seoPlugin = () => {
  let generated = false;
  return {
    name: "generate-seo",
    buildStart() {
      if (!generated) {
        generateSEOFiles();
        generated = true;
      }
    },
    handleHotUpdate({ file }: { file: string }) {
      if (file.includes("private/contents")) {
        console.log("Markdown change detected, regenerating SEO files...");
        generateSEOFiles();
      }
    },
  };
};

export default defineConfig({
  vite: {
    environments: {
      rsc: {
        optimizeDeps: {
          include: ["hono/tiny"],
        },
        build: {
          rolldownOptions: {
            platform: "neutral",
          } as never,
        },
      },
      ssr: {
        optimizeDeps: {
          include: ["waku > rsc-html-stream/server"],
        },
        build: {
          rolldownOptions: {
            platform: "neutral",
          } as never,
        },
      },
    },
    plugins: [
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      seoPlugin(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@private": path.resolve(__dirname, "private"),
        "@content": path.resolve(__dirname, "private/contents"),
      },
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "EVAL" && warning.id?.includes("gray-matter")) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
