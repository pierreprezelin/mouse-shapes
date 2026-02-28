<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <UContainer class="h-screen flex flex-1 flex-col items-center justify-center">
    <h1 class="pb-4 text-center text-4xl font-bold">{{ error?.status }}</h1>
    <p class="text-muted pb-10 text-center text-lg font-normal">
      {{ error?.statusText }}
    </p>
    <UButton
      color="neutral"
      variant="subtle"
      size="xl"
      class="text-muted hover:text-default cursor-pointer"
      @click="handleError"
    >
      Back to Home
    </UButton>
  </UContainer>
</template>
