<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const { copy, copied } = useClipboard()

const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')
const searchTerm = ref("")

const DEFAULT_MODELS = ['zowie-ec3-dw', 'lamzu-atlantis-mini', 'logitech-g-pro-x-superlight-2']

const urlSlugs = computed(() => {
  const s = route.query.models as string
  return s ? s.split(',').filter(Boolean) : []
})

const { data: catalog } = await useFetch('/api/models/catalog')

const { data: models, pending } = await useFetch('/api/models', {
  query: { models: computed(() => urlSlugs.value.join(',')) },
  watch: [urlSlugs],
  immediate: true
})
const selectedModels = computed(() => models.value || [])

function handleModelSelection(item: any) {
  if (!item) return
  const newSlug = item.slug || item.value

  if (urlSlugs.value.includes(newSlug)) {
    searchTerm.value = ""
    return
  }
  const updatedSlugs = [...urlSlugs.value, newSlug]

  router.push({
    query: { ...route.query, models: updatedSlugs.join(',') }
  })
  searchTerm.value = ""
}

function handleModelRemoval(id: number) {
  const model = selectedModels.value.find(m => m.id === id)
  if (!model) return

  const updatedSlugs = urlSlugs.value.filter(s => s !== model.slug)

  router.push({
    query: {
      ...route.query,
      models: updatedSlugs.length ? updatedSlugs.join(',') : undefined
    }
  })
}

function clearAll() {
  router.push({ query: { ...route.query, models: undefined } })
}

onMounted(() => {
  if (!route.query.models) {
    router.replace({
      query: { ...route.query, models: DEFAULT_MODELS.join(',') }
    })
  }
})
</script>

<template>
  <UContainer class="flex-1 flex flex-col">
    <template v-if="selectedModels.length === 0">
      <h1 class="text-4xl font-bold text-center pb-4">MouseShapes</h1>
      <p class="text-lg text-muted font-normal text-center pb-10">
        A reverse-engineering of eloshapes.com for fun and to
        get up to date with Nuxt v4.
      </p>
    </template>

    <div class="flex flex-col">
      <div class="flex flex-nowrap justify-center items-center gap-3">
        <UInputMenu v-model:search-term="searchTerm" :items="catalog || []" :loading="pending" placeholder="Add mouse to comparison..."
          variant="soft" size="xl" open-on-click open-on-focus clear clear-icon="i-lucide-circle-x"
          :selected-icon="null" :disabled="selectedModels.length >= 5" class="w-100" :class="{ 'py-6': selectedModels.length > 0 }"
          @update:model-value="handleModelSelection" />

        <UTooltip text="Copy to clipboard">
          <UButton :color="copied ? 'success' : 'neutral'" variant="link"
            :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            :aria-label="copied ? 'Copied!' : 'Copy to clipboard'" @click="copy(shareUrl)" />
        </UTooltip>

        <UTooltip v-if="selectedModels.length > 1" text="Remove all models from comparison">
          <UButton variant="link"
            icon="i-lucide-trash"
            aria-label="Remove all models from comparison" @click="clearAll()" />
        </UTooltip>
      </div>
    </div>

    <template v-if="selectedModels.length > 0">
      <SVGView :models="selectedModels" @remove-model="handleModelRemoval" />
      <Table :models="selectedModels" @remove-model="handleModelRemoval" />
    </template>
  </UContainer>
</template>
