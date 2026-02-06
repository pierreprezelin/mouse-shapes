<script setup lang="ts">
import type { Model } from '~/types/supabase'

const searchTerm = ref("")

const { data: models, status } = await useAsyncData(
  'get-models',
  async () => {
    const client = useSupabaseClient()
    const { data, error } = await client
      .from('models')
      .select("*")
      .order('brand', { ascending: true })

    if (error) throw error
    return data
  },
  {
    transform: (data) => {
      return data?.map(model => ({
        label: `${model.brand} ${model.name}`,
        value: String(model.id),
        ...model
      }))
    },
    lazy: true,
    server: true
  }
)

const selectedModels = ref<Model[]>([])

const handleModelSelection = (item: any) => {
  if (item) {
    selectedModels.value.push(item)
    nextTick(() => {
      searchTerm.value = ""
    })
  }
}

const handleModelRemoval = (id: number) => {
  selectedModels.value = selectedModels.value.filter(m => m.id !== id)
}
</script>

<template>
  <UContainer>
    <div class="text-center">
      <h1 class="text-lg py-6">A reverse-engineering of eloshapes.com for fun and to get up to date with Nuxt v4.</h1>
      <UInputMenu v-model:search-term="searchTerm" :items="models" :loading="status === 'pending'"
        placeholder="Add mouse ot comparison..." size="xl" open-on-click open-on-focus clear
        clear-icon="i-lucide-circle-x" class="w-100" @update:model-value="handleModelSelection" />
    </div>
    <div class="flex gap-6 items-center">
      <ul>
        <li v-for="model in selectedModels" :key="model.id">
          <div>{{ model.brand }} {{ model.name }}</div>
          <div>{{ model.length }} x {{ model.width }} x {{ model.height }} mm</div>
          <UButton color="neutral" variant="ghost" @click="handleModelRemoval(model.id)">x</UButton>
        </li>
      </ul>
    </div>
    {{ searchTerm }}
  </UContainer>
</template>
