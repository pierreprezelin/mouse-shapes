// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/a11y",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/supabase",
    'nuxt-toast'
  ],
  devtools: {
    enabled: true,
  },
  css: ["~/assets/css/main.css"],
  routeRules: {
    "/": { prerender: true },
  },
  compatibilityDate: "2025-01-15",
  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  typescript: {
    typeCheck: true,
  },
  supabase: {
    redirect: false,
    types: "@/types/database.ts",
  },
  toast: {
    settings: {
      timeout: 3000,
      closeOnEscape: true,
      closeOnClick: true,
    }
  }
});
