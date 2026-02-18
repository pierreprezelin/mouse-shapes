<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import type { Model } from "~/types/database";

const route = useRoute();
const router = useRouter();
const requestUrl = useRequestURL();
const toast = useToast();
const { copy, copied } = useClipboard();

const shareUrl = computed(() => {
  return requestUrl.href;
});
const searchTerm = ref("");

const DEFAULT_MODELS = [
  "zowie-ec3-dw",
  "lamzu-atlantis-mini",
  "logitech-g-pro-x-superlight-2",
];

const hasModelsParam = computed(() => "models" in route.query);
const urlSlugs = computed(() => {
  const s = route.query.models as string;
  if (!hasModelsParam.value) {
    return DEFAULT_MODELS;
  }
  return s ? s.split(",").filter(Boolean) : [];
});

const { data: catalog } = await useFetch("/api/models/catalog");

const { data: models, pending } = await useFetch("/api/models", {
  query: { models: computed(() => urlSlugs.value.join(",")) },
  watch: [urlSlugs],
  immediate: true,
});

const selectedModels = computed(() => {
  if (!models.value) return [];
  return models.value
    .filter((m: Model) => urlSlugs.value.includes(m.slug as string))
    .sort((a: Model, b: Model) => {
      return urlSlugs.value.indexOf(a.slug as string) - urlSlugs.value.indexOf(b.slug as string);
    });
});

const menuItems = computed(() => {
  if (!catalog.value) return [];
  return catalog.value.map((item: any) => ({
    ...item,
    disabled: urlSlugs.value.includes(item.slug || item.value),
  }));
});

onMounted(() => {
  if (!route.query.models) {
    router.replace({
      query: { ...route.query, models: DEFAULT_MODELS.join(",") },
    });
  }
});

function handleModelSelection(item: any) {
  if (!item) return;
  const newSlug = item.slug || item.value;

  if (urlSlugs.value.includes(newSlug)) {
    searchTerm.value = "";
    return;
  }
  const updatedSlugs = [...urlSlugs.value, newSlug];

  router.push({
    query: { ...route.query, models: updatedSlugs.join(",") },
  });
  searchTerm.value = "";
}

function handleModelRemoval(id: number) {
  const model = selectedModels.value.find((m: Model) => m.id === id);
  if (!model) return;

  const updatedSlugs = urlSlugs.value.filter((s) => s !== model.slug);

  router.push({
    query: {
      ...route.query,
      models: updatedSlugs.length ? updatedSlugs.join(",") : "",
    },
  });
}

function handleCopyToClipboard() {
  copy(shareUrl.value);
  toast.add({
    title: "URL copied to clipboard.",
    icon: "i-lucide-check",
    color: "success",
  });
}

function clearAll() {
  router.push({ query: { ...route.query, models: "" } });
  searchTerm.value = "";
}
</script>

<template>
  <UContainer
    class="flex flex-1 flex-col"
    :class="{ 'items-center justify-center': selectedModels.length === 0 }"
  >
    <template v-if="selectedModels.length === 0">
      <h1 class="pb-4 text-center text-4xl font-bold">MouseShapes</h1>
      <p class="text-muted pb-10 text-center text-lg font-normal">
        A reverse-engineering of eloshapes.com for fun and to get up to date
        with Nuxt v4.
      </p>
    </template>
    <div
      class="bg-default flex w-full flex-nowrap items-center justify-center gap-1.5 md:gap-3"
      :class="
        selectedModels.length > 0 ? 'fixed top-[h-screen] left-0 z-50 py-4' : ''
      "
    >
      <UInputMenu
        v-model:search-term="searchTerm"
        :items="menuItems || []"
        :loading="pending"
        placeholder="Add mouse to comparison..."
        variant="soft"
        size="xl"
        open-on-click
        open-on-focus
        clear
        clear-icon="i-lucide-circle-x"
        :disabled="selectedModels.length >= 5"
        class="md:w-100"
        :class="{ 'me-2': selectedModels.length > 0 }"
        @update:model-value="handleModelSelection"
      />
      <UTooltip v-if="!!route.query.models" text="Copy to clipboard">
        <UButton
          class="text-muted hover:text-default cursor-pointer"
          variant="link"
          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          :aria-label="copied ? 'Copied!' : 'Copy to clipboard'"
          @click="handleCopyToClipboard()"
        />
      </UTooltip>
      <UTooltip
        v-if="selectedModels.length > 1"
        text="Remove all models from comparison"
      >
        <UButton
          variant="link"
          icon="i-lucide-trash"
          aria-label="Remove all models from comparison"
          class="text-muted hover:text-default cursor-pointer"
          @click="clearAll()"
        />
      </UTooltip>
    </div>
    <template v-if="selectedModels.length > 0">
      <SVGView :models="selectedModels" @remove-model="handleModelRemoval" />
      <Table :models="selectedModels" @remove-model="handleModelRemoval" />
    </template>
  </UContainer>
</template>
