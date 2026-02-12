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
    <div class="pb-6 overflow-x-auto w-auto">
      <table class="text-sm text-left border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <tr>
            <td class="w-52 p-4 font-semibold">Model</td>
            <td v-for="(model, index) in models" :key="model.id" class="w-52 p-4 text-center font-semibold" :class="{'bg-elevated': index === 0}">
              <UButton color="neutral" icon="i-lucide-x" variant="ghost" @click="handleModelRemoval(model.id)" />
              <span class="block text-muted text-sm mt-2.5">{{ model.brand }}</span>
              {{ model.name }}
            </td>
          </tr>
          <tr v-for="spec in specs" :key="spec.label">
            <td class="w-52 p-4 font-semibold text-sm">
              {{ spec.label }}
              <UBadge v-if="spec.unit" color="neutral" variant="soft" class="ms-1">{{ spec.unit }}</UBadge>
            </td>
            <td v-for="(model, index) in models" :key="model.id" class="w-52 p-4 text-center text-sm" :class="{'bg-elevated': index === 0}">
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

<style lang="scss" scoped>
table {
  tr {
    white-space: nowrap;
  }
}
</style>
