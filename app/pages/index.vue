<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { Model } from '~/types/database'

const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()

const urlSlugs = computed(() => {
  const slugs = route.query.compare as string
  return slugs ? slugs.split(',').map(Number) : [1, 2, 3]
})
const { copy, copied } = useClipboard()
const shareUrl = computed(() => window.location.href)
const searchTerm = ref("")
const selectedModels = ref<Model[]>([])

const { data: catalog } = await useAsyncData(
  'catalog',
  async () => {
    const { data, error } = await client
      .from('models')
      .select("id, brand, name")
      .order('brand', { ascending: true })

    if (error) throw error
    return data?.map(m => ({ label: `${m.brand} ${m.name}`, value: String(m.id), id: m.id }))
  },
)

const { data: initialTableData } = await useAsyncData(
  'initial-table-data',
  async () => {
    const { data } = await client
      .from('models')
      .select('*')
      .in('id', urlSlugs.value)
    return data
  },
  { watch: [urlSlugs] }
)

if (initialTableData.value) {
  selectedModels.value = initialTableData.value
}

const handleModelSelection = async (item: any) => {
  if (!item || selectedModels.value.some(m => m.id === item.id)) return
  const { data } = await client.from('models').select('*').eq('id', item.id).single()
  if (data) {
    selectedModels.value.push(data)
    searchTerm.value = ""
  }
}

const handleModelRemoval = (id: number) => {
  selectedModels.value = selectedModels.value.filter(m => m.id !== id)
}

watch(selectedModels, (newModels) => {
  const slugs = newModels.map(m => m.slug).join(',')
  if (route.query.compare !== slugs) {
    router.replace({
      query: { ...route.query, compare: slugs || undefined }
    })
  }
}, { deep: true })
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
        <UInputMenu v-model:search-term="searchTerm" :items="catalog || []" placeholder="Add mouse to comparison..."
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
            aria-label="Remove all models from comparison" @click="selectedModels = []" />
        </UTooltip>
      </div>
    </div>
    <template v-if="selectedModels.length > 0">
      <SVGView :models="selectedModels" @remove-model="handleModelRemoval" />
      <Table :models="selectedModels" @remove-model="handleModelRemoval" />
    </template>
  </UContainer>
</template>
