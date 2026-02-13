<script lang="ts" setup>
import type { Model } from '~/types/database';

defineProps<{
  models: Model[]
}>()

const emit = defineEmits(['removeModel']);

function handleModelRemoval(id: number) {
  emit('removeModel', id);
}

interface SpecItem {
  label: string
  key: keyof Model
  unit?: string
  isBoolean?: boolean
  map?: Record<number | string, string>
}

const specs: SpecItem[] = [
  { label: 'Length', key: 'length', unit: 'mm' },
  { label: 'Width', key: 'width', unit: 'mm' },
  { label: 'Height', key: 'height', unit: 'mm' },
  { label: 'Weight', key: 'weight', unit: 'g' },
  { label: 'Shape', key: 'shape', map: SHAPE },
  { label: 'Hump Location', key: 'hump_location', map: HUMP_LOCATION },
  { label: 'Front Flare', key: 'front_flare', map: FRONT_FLARE },
  { label: 'Side Curvature', key: 'side_curvature', map: SIDE_CURVATURE },
  { label: 'Hand Compatibility', key: 'hand_compatibility', map: HAND_COMPATIBILITY },
  { label: 'Thumb Rest', key: 'thumb_rest', isBoolean: true },
  { label: 'Ring Finger Rest', key: 'ring_finger_rest', isBoolean: true },
  { label: 'Sensor', key: 'sensor' },
  { label: 'Sensor Position', key: 'sensor_position', map: SENSOR_POSITION },
  { label: 'Sensor Technology', key: 'sensor_technology', map: SENSOR_TECHNOLOGY },
  { label: 'DPI', key: 'dpi' },
  { label: 'Polling Rate', key: 'polling_rate', unit: 'Hz' },
  { label: 'Tracking Speed', key: 'tracking_speed', unit: 'IPS' },
  { label: 'Acceleration', key: 'acceleration', unit: 'G' },
  { label: 'Side Buttons', key: 'side_buttons' },
  { label: 'Middle Buttons', key: 'middle_buttons' },
  { label: 'Hot-swap Switches', key: 'hotswap_switches', isBoolean: true },
  { label: 'Switches', key: 'switches', map: SWITCHES },
  { label: 'Connectivity', key: 'connectivity', map: CONNECTIVITY },
  { label: 'Material', key: 'material', map: MATERIAL },
]
</script>

<template>
  <section>
    <div class="relative overflow-x-auto overflow-y-auto w-max max-h-[calc(100vh-var(--ui-header-height)-88px)] mx-auto border border-zinc-200 dark:border-zinc-700 rounded-lg">
      <table class="w-max text-sm text-left">
        <thead class="relative z-20">
          <tr class="border-b border-zinc-200 dark:border-zinc-700">
            <th class="sticky z-20 top-0 w-52 min-w-56 bg-default"></th>
            <th v-for="(model, index) in models" :key="model.id"
              class="sticky z-20 top-0 w-52 min-w-56 p-4 text-center font-semibold bg-default"
              :class="{ 'bg-elevated': index === 0 }">
              <UButton variant="ghost" icon="i-lucide-x" class="text-muted hover:text-default cursor-pointer" @click="handleModelRemoval(model.id)" />
              <span class="block text-muted text-sm mt-2.5">{{ model.brand }}</span>
              {{ model.name }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 dark:divide-zinc-700">
          <tr v-for="spec in specs" :key="spec.label">
            <td class="w-56 p-4 font-semibold text-sm bg-default">
              {{ spec.label }}
              <UBadge v-if="spec.unit" color="neutral" variant="soft" class="ms-1">{{ spec.unit }}</UBadge>
            </td>
            <td v-for="(model, index) in models" :key="model.id" class="w-56 p-4 text-center text-sm"
              :class="{ 'bg-elevated': index === 0 }">
              <template v-if="spec.isBoolean">
                <span :class="model[spec.key] ? 'text-success' : 'text-error'">
                  {{ model[spec.key] ? 'Yes' : 'No' }}
                </span>
              </template>
              <template v-else-if="spec.map">
                {{ model[spec.key] !== null ? spec.map[model[spec.key] as any] : '-' }}
              </template>
              <template v-else>
                {{ model[spec.key] ?? '-' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
