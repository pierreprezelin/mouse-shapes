<script lang="ts" setup>
import type { Model } from "~/types/database";

const thickness = ref(20);
const scale = ref(100);
const hiddenModels = ref(new Set<number>());
const hoveredModelId = ref<number | null>(null);

const colors = ["#00C8FF", "#FF00EE", "#FFEA00"];

defineProps<{
  models: Model[];
}>();

const emit = defineEmits(["removeModel"]);

function handleModelRemoval(id: number) {
  emit("removeModel", id);
}

function handleModelHidden(id: number) {
  if (hiddenModels.value.has(id)) {
    hiddenModels.value.delete(id);
  } else {
    hiddenModels.value.add(id);
  }
}
const isHidden = (id: number) => hiddenModels.value.has(id);

type Alignment =
  | "topLeft"
  | "top"
  | "topRight"
  | "center"
  | "bottomLeft"
  | "bottom"
  | "bottomRight";
const alignment = ref<Alignment>("center");

function getTransformOrigin() {
  return {
    topLeft: "left top",
    top: "center top",
    topRight: "right top",
    center: "center center",
    bottomLeft: "left bottom",
    bottom: "center bottom",
    bottomRight: "right bottom",
  }[alignment.value];
}
</script>

<template>
  <section>
    <div
      class="flex min-h-[calc(100vh-var(--ui-header-height))] flex-nowrap gap-12"
    >
      <div
        class="relative z-2 flex h-full min-h-[calc(100vh-var(--ui-header-height))] w-full max-w-92 flex-1 shrink-0 flex-col items-center justify-center gap-10 pt-16 backdrop-blur-sm"
      >
        <ul class="group flex w-full flex-col gap-px overflow-y-auto">
          <li
            v-for="model in models"
            :key="model.id"
            class="bg-elevated flex w-full items-center justify-between gap-6 opacity-100 group-hover:opacity-[66.666%] first:rounded-t-lg last:rounded-b-lg hover:opacity-100"
            :class="isHidden(model.id) ? 'opacity-50!' : ''"
            @mouseenter="hoveredModelId = model.id"
            @mouseleave="hoveredModelId = null"
          >
            <div class="flex flex-col justify-center py-3 ps-3">
              <span>{{ model.brand }} {{ model.name }}</span>
              <span class="text-muted block text-sm">
                {{ model.length }} x {{ model.width }} x {{ model.height }} mm ·
                {{ model.weight }}g
              </span>
            </div>
            <div class="flex flex-col justify-center pe-1">
              <UButton
                color="neutral"
                icon="i-lucide-x"
                variant="ghost"
                size="sm"
                class="text-muted hover:text-default cursor-pointer"
                @click="handleModelRemoval(model.id)"
              />
              <UButton
                color="neutral"
                :icon="isHidden(model.id) ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                variant="ghost"
                size="sm"
                class="text-muted hover:text-default cursor-pointer"
                @click="handleModelHidden(model.id)"
              />
            </div>
          </li>
        </ul>
        <div class="sliders w-full">
          <span class="item-baseline mb-4 flex">
            Thickness
            <span class="text-muted ps-2 text-sm">
              {{ thickness * 5 }}%
            </span>
          </span>
          <USlider
            v-model="thickness"
            :default-value="20"
            :min="0"
            :max="40"
            :step="1"
          />
          <span class="item-baseline mt-6 mb-4 flex">
            Size
            <span class="text-muted ps-2 text-sm">{{ scale }}%</span>
          </span>
          <USlider
            v-model="scale"
            :default-value="100"
            :min="0"
            :max="200"
            :step="1"
          />
          <span class="mt-6 mb-4 flex">Alignment</span>
          <USelect
            v-model="alignment"
            :items="
              Object.entries(ALIGNMENT).map(([key, value]) => ({
                label: value,
                value: key,
              }))
            "
            class="w-32 hover:cursor-pointer"
          />
        </div>
      </div>
      <div
        class="pointer-events-none relative z-1 flex flex-1 flex-nowrap gap-6 pt-16"
        :style="{ transform: `scale(${scale / 100})` }"
      >
        <div class="relative aspect-612/1180 h-full w-full max-w-[36%]">
          <template v-for="model in models" :key="`top-${model.id}`">
            <svg
              v-if="!isHidden(model.id)"
              viewBox="0 0 612 1180"
              class="absolute inset-0 h-full w-full"
              :class="
                hoveredModelId !== null && hoveredModelId === model.id
                  ? 'z-10'
                  : ''
              "
            >
              <path
                :d="model.shape_path_top"
                fill="transparent"
                stroke="#3b82f6"
                :stroke-width="thickness / 10"
                class="[transition:transform_0.4s_cubic-bezier(0.4,0,0.2,1),transform-origin_0.4s_cubic-bezier(0.4,0,0.2,1)]"
                vector-effect="non-scaling-stroke"
                :style="{
                  transform: `scale(${model.length / 130})`,
                  transformOrigin: getTransformOrigin(),
                  transformBox: 'fill-box',
                  opacity:
                    hoveredModelId !== null && hoveredModelId !== model.id
                      ? 0.2
                      : 1,
                }"
              />
            </svg>
          </template>
        </div>
        <div class="relative aspect-1180/388 h-full w-full">
          <template v-for="model in models" :key="`side-${model.id}`">
            <svg
              v-if="!isHidden(model.id)"
              viewBox="0 0 1180 388"
              class="absolute inset-0 h-full w-full"
              :class="
                hoveredModelId !== null && hoveredModelId === model.id
                  ? 'z-10'
                  : ''
              "
            >
              <path
                :d="model.shape_path_side"
                fill="transparent"
                stroke="#3b82f6"
                :stroke-width="thickness / 10"
                vector-effect="non-scaling-stroke"
                class="[transition:transform_0.4s_cubic-bezier(0.4,0,0.2,1),transform-origin_0.4s_cubic-bezier(0.4,0,0.2,1)]"
                :style="{
                  transform: `scale(${model.length / 130})`,
                  transformOrigin: getTransformOrigin(),
                  transformBox: 'fill-box',
                  opacity:
                    hoveredModelId !== null && hoveredModelId !== model.id
                      ? 0.2
                      : 1,
                }"
              />
            </svg>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
