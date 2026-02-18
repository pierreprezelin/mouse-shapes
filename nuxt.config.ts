// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxtjs/supabase",
  ],
  devtools: {
    enabled: true,
  },
  css: ["~/assets/css/main.css"],
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
  colorMode: {
    preference: "dark",
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
});
