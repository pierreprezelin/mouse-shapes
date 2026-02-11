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

watch(models, (newModels) => {
  if (newModels && selectedModels.value.length === 0) {
    selectedModels.value = newModels.filter(model =>
      ['1', '2', '3'].includes(model.value)
    )
  }
}, { immediate: true })

const handleModelSelection = (item: any) => {
  if (!item || selectedModels.value.some(m => m.id === item.id)) return;
  selectedModels.value.push(item);
  nextTick(() => {
    searchTerm.value = "";
  })
}

const handleModelRemoval = (id: number) => {
  selectedModels.value = selectedModels.value.filter(m => m.id !== id);
}
</script>

<template>
  <UContainer>
    <div class="text-center">
      <h1 class="text-lg py-6">A reverse-engineering of eloshapes.com for fun and to get up to date with Nuxt v4.</h1>
      <UInputMenu v-model:search-term="searchTerm" :items="models" :loading="status === 'pending'"
        placeholder="Add mouse to comparison..." size="lg" open-on-click open-on-focus clear
        clear-icon="i-lucide-circle-x" :selected-icon="null" class="w-100" @update:model-value="handleModelSelection" />
    </div>
    <div class="flex gap-6 items-center py-12">
      <ul class="flex flex-col gap-px">
        <li v-for="model in selectedModels" :key="model.id"
          class="flex justify-between items-start bg-elevated first:rounded-t-lg last:rounded-b-lg">
          <div class="py-2 ps-3 pe-6">
            <span class="text-sm">{{ model.brand }} {{ model.name }}</span>
            <span class="block text-xs text-muted">{{ model.length }} x {{ model.width }} x {{ model.height }} mm · {{
              model.weight }}g</span>
          </div>
          <UButton color="neutral" variant="ghost" class="py-2 px-3 text-muted" @click="handleModelRemoval(model.id)">x
          </UButton>
        </li>
      </ul>
    </div>
    <div v-if="selectedModels.length > 0" class="border border-neutral-200 dark:border-neutral-800 rounded-lg">
      <table class="overflow-x-auto w-full text-sm text-left">
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <tr>
            <td class="p-4 font-semibold">Model</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center font-semibold">
              <UButton color="neutral" variant="ghost" @click="handleModelRemoval(model.id)">x</UButton>
              <span class="block text-muted text-sm">{{ model.brand }}</span>
              {{ model.name }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Length <UBadge color="neutral" variant="soft" class="ms-1">mm</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.length }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Width <UBadge color="neutral" variant="soft" class="ms-1">mm</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.width }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Height <UBadge color="neutral" variant="soft" class="ms-1">mm</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.height }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Weight <UBadge color="neutral" variant="soft" class="ms-1">g</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.weight }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Shape</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ SHAPE[model.shape] }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Hump Location</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.hump_location ? HUMP_LOCATION[model.hump_location] : "-" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Front Flare</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.front_flare ? FRONT_FLARE[model.front_flare] : "-" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Side Curvature</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.side_curvature ? SIDE_CURVATURE[model.side_curvature] : "-" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Hand Compatibility</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ HAND_COMPATIBILITY[model.hand_compatibility] }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Thumb Rest</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center"
              :class="model.thumb_rest ? 'text-success' : 'text-error'">
              {{ !!model.thumb_rest ? "Yes" : "No" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Ring Finger Rest</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center"
              :class="model.ring_finger_rest ? 'text-success' : 'text-error'">
              {{ !!model.ring_finger_rest ? "Yes" : "No" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Sensor</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.sensor }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Sensor Position</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.sensor_position ? SENSOR_POSITION[model.sensor_position] : "-" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Sensor Technology</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.sensor_technology ? SENSOR_TECHNOLOGY[model.sensor_technology] : "-" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">DPI</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.dpi }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Polling Rate <UBadge color="neutral" variant="soft" class="ms-1">Hz</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.polling_rate }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Tracking Speed <UBadge color="neutral" variant="soft" class="ms-1">IPS</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.tracking_speed }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">
              Acceleration <UBadge color="neutral" variant="soft" class="ms-1">G</UBadge>
            </td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.acceleration }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Side Buttons</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.side_buttons }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Middle Buttons</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.middle_buttons }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Hot-swap Switches</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center"
              :class="model.hotswap_switches ? 'text-success' : 'text-error'">
              {{ !!model.hotswap_switches ? "Yes" : "No" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Switches</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.switches ? SWITCHES[model.switches] : "-" }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Connectivity</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ CONNECTIVITY[model.connectivity] }}
            </td>
          </tr>
          <tr>
            <td class="p-4 font-semibold">Material</td>
            <td v-for="model in selectedModels" :key="model.id" class="p-4 text-center">
              {{ model.material ? MATERIAL[model.material] : "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UContainer>
</template>

<style>
table tr {
  white-space: nowrap;
}

ul:hover li span {
  opacity: 0.75;
}

ul:hover li:hover span {
  opacity: 1;
}

ul li:hover button {
  color: var(--ui-text);
}
</style>
