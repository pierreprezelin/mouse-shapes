<script setup lang="ts">
import type { Model } from '~/types/database'

const client = useSupabaseClient()
const searchTerm = ref("")
const isLoading = ref(false)
const selectedModels = ref<Model[]>([])

const { data: catalog } = await useAsyncData(
  'catalog',
  async () => {
    const { data, error } = await client
      .from('models')
      .select("id, brand, name")
      .order('brand', { ascending: true })

    if (error) throw error
    return data?.map(model => ({ label: `${model.brand} ${model.name}`, value: String(model.id), id: model.id }))
  },
)

const { data: initialTableData } = await useAsyncData('initial-table-data', async () => {
  const { data } = await client
    .from('models')
    .select('*')
    .in('id', [1, 2, 3])
  return data
})

if (initialTableData.value) {
  selectedModels.value = initialTableData.value
}

const handleModelSelection = async (item: any) => {
  if (!item || selectedModels.value.some(model => model.id === item.id)) return
  isLoading.value = true;
  const { data } = await client.from('models').select('*').eq('id', item.id).single()
  if (data) {
    selectedModels.value.push(data)
    searchTerm.value = ""
  }
}

const handleModelRemoval = (id: number) => {
  selectedModels.value = selectedModels.value.filter(model => model.id !== id)
}
</script>

<template>
  <UContainer>
    <template v-if="selectedModels.length === 0">
      <h1 class="text-4xl font-bold text-center pb-4">MouseShapes</h1>
      <p class="text-lg text-muted font-normal text-center pb-10">A reverse-engineering of eloshapes.com for fun and to
        get up to date with Nuxt v4.</p>
    </template>
    <UInputMenu v-model:search-term="searchTerm" :items="catalog || []" placeholder="Add mouse to comparison..."
      variant="soft" size="xl" open-on-click open-on-focus clear clear-icon="i-lucide-circle-x" :selected-icon="null"
      class="w-100 flex mx-auto" :class="{ 'py-6': selectedModels.length > 0 }"
      @update:model-value="handleModelSelection" />
    <template v-if="selectedModels.length > 0">
      <SVGView :models="selectedModels" @remove-model="handleModelRemoval" />
      <Table :models="selectedModels" @remove-model="handleModelRemoval" />
    </template>
  </UContainer>
</template>
