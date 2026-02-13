<script lang="ts" setup>
import type { Model } from '~/types/database'

const thickness = ref(40);
const scale = ref(80);
const colors = ["#00C8FF", "#FF00EE", "#FFEA00"];

defineProps<{
  models: Model[]
}>()

const emit = defineEmits(['removeModel']);

function handleModelRemoval(id: number) {
  emit('removeModel', id);
}

type Alignment = 'topLeft' | 'top' | 'topRight' | 'center' | 'bottomLeft' | 'bottom' | 'bottomRight';
const alignment = ref<Alignment>('center');

function getTransformOrigin() {
  return {
    topLeft: 'left top',
    top: 'center top',
    topRight: 'right top',
    center: 'center center',
    bottomLeft: 'left bottom',
    bottom: 'center bottom',
    bottomRight: 'right bottom'
  }[alignment.value]
}
</script>

<template>
  <section>
    <div class="min-h-[calc(100vh-var(--ui-header-height)-88px)] flex flex-nowrap gap-12">
      <div
        class="relative z-2 w-full max-w-92 h-full min-h-[calc(100vh-var(--ui-header-height)-88px)] flex flex-col gap-10 flex-1 shrink-0 justify-center items-center backdrop-blur-sm">
        <ul class="group flex flex-col gap-px w-full overflow-y-auto">
          <li v-for="model in models" :key="model.id"
            class="w-full flex justify-between items-start bg-elevated first:rounded-t-lg last:rounded-b-lg opacity-100 group-hover:opacity-75 hover:opacity-100!">
            <div class="py-3 ps-3 pe-6">
              <span>{{ model.brand }} {{ model.name }}</span>
              <span class="block text-sm text-muted">
                {{ model.length }} x {{ model.width }} x {{ model.height }} mm · {{ model.weight }}g
              </span>
            </div>
            <UButton color="neutral" icon="i-lucide-x" variant="ghost"
              class="py-3.5 px-3 text-muted hover:text-default cursor-pointer" @click="handleModelRemoval(model.id)" />
          </li>
        </ul>
        <div class="sliders w-full">
          <span class="flex item-baseline mb-4">
            Thickness <span class="text-muted text-sm ps-2">{{ thickness * 25 / 10 }}%</span>
          </span>
          <USlider v-model="thickness" :default-value="40" :min="0" :max="80" :step="1" />
          <span class="flex item-baseline mt-6 mb-4">
            Size <span class="text-muted text-sm ps-2">{{ scale }}%</span>
          </span>
          <USlider v-model="scale" :default-value="100" :min="0" :max="300" :step="10" />
          <span class="flex mt-6 mb-4">Alignment</span>
          <USelect v-model="alignment"
            :items="Object.entries(ALIGNMENT).map(([key, value]) => ({ label: value, value: key }))"
            class="w-32 hover:cursor-pointer" />
        </div>
      </div>
      <div class="relative z-1 flex-1 flex flex-nowrap gap-6 pointer-events-none"
        :style="{ transform: `scale(${scale / 100})` }">
        <div class="relative w-full max-w-[36%] h-full aspect-612/1180">
          <template v-for="model in models" :key="`top-${model.id}`">
            <svg viewBox="0 0 612 1180" class="absolute inset-0 w-full h-full">
              <path :d="model.shape_path_top" fill="transparent" stroke="#3b82f6" :stroke-width="thickness / 10"
                class="[transition:transform_0.4s_cubic-bezier(0.4,0,0.2,1),transform-origin_0.4s_cubic-bezier(0.4,0,0.2,1)]"
                vector-effect="non-scaling-stroke" :style="{
                  transform: `scale(${model.length / 130})`,
                  transformOrigin: getTransformOrigin(),
                  transformBox: 'fill-box'
                }" />
            </svg>
          </template>
        </div>
        <div class="relative w-full h-full">
          <template v-for="model in models" :key="`side-${model.id}`">
            <div class="absolute inset-0 w-full h-full aspect-1180/388">
              <svg viewBox="0 0 1180 388">
                <path :d="model.shape_path_side" fill="transparent" stroke="#3b82f6" :stroke-width="thickness / 10"
                  vector-effect="non-scaling-stroke"
                  class="[transition:transform_0.4s_cubic-bezier(0.4,0,0.2,1),transform-origin_0.4s_cubic-bezier(0.4,0,0.2,1)]"
                  :style="{
                    transform: `scale(${model.length / 130})`,
                    transformOrigin: getTransformOrigin(),
                    transformBox: 'fill-box'
                  }" />
              </svg>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
