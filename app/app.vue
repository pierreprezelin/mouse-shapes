<script setup>
const toaster = { duration: 3000 }

const title = "MouseShapes";
const description =
  "A reverse-engineering of eloshapes.com for fun and to get up to date with Vue 3.";

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLoadingIndicator />
  <UApp :toaster="toaster">
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="shrink-0 text-lg font-semibold">
          🖱️ MouseShapes
        </NuxtLink>
      </template>
      <template #right>
        <UColorModeButton />
        <UButton
          to="https://pierreprezelin.com/"
          target="_blank"
          icon="i-lucide-rocket"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
        <UButton
          to="https://github.com/pierreprezelin/mouse-shapes"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>
    <UMain>
      <NuxtPage />
    </UMain>
    <UFooter>
      <template #default>
        <p class="text-muted lg:pt-6 text-sm">
          🧪 A coding exercise based on
          <NuxtLink
            to="https://www.eloshapes.com/"
            target="_blank"
            class="transition-colors hover:text-white"
            >eloshapes.com</NuxtLink
          >
          · Pierre Prézelin © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>

<style lang="scss">
html,
body {
  overflow-x: clip;
}

main {
  display: flex;
  flex-direction: column;
}
</style>
