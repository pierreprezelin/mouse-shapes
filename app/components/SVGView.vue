<script lang="ts" setup>
import type { Model } from "~/types/database";

const colors = ["#00C8FF", "#FF00EE", "#FFEA00", "#00FFC4", "#9E00FF"];

const thickness = ref(20);
const scale = ref(100);
const hiddenModels = ref(new Set<number>());
const hoveredModelId = ref<number | null>(null);

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
      class="flex h-[calc(100vh-var(--ui-header-height)-88px)] flex-nowrap gap-12 pb-6"
    >
      <div
        class="relative z-2 flex h-full w-full max-w-92 flex-1 shrink-0 flex-col items-center justify-center gap-10 backdrop-blur-sm"
      >
        <ul class="group flex w-full flex-col gap-px overflow-y-auto">
          <li
            v-for="(model, index) in models"
            :key="model.id"
            class="bg-elevated flex w-full items-center justify-between opacity-100 group-hover:opacity-[66.666%] first:rounded-t-lg last:rounded-b-lg hover:opacity-100"
            :class="isHidden(model.id) ? 'opacity-50!' : ''"
            @mouseenter="
              !isHidden(model.id) ? (hoveredModelId = model.id) : null
            "
            @mouseleave="hoveredModelId = null"
          >
            <div class="flex gap-4 p-2">
              <div
                class="w-2 shrink-0 self-stretch rounded-full"
                :style="{ backgroundColor: colors[index % colors.length] }"
              />
              <div class="flex flex-col justify-center py-2">
                <span>{{ model.brand }} {{ model.name }}</span>
                <span class="text-muted block text-sm">
                  {{ model.length }} x {{ model.width }} x {{ model.height }} mm
                  · {{ model.weight }}g
                </span>
              </div>
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
            <span class="text-muted ps-2 text-sm"> {{ thickness * 5 }}% </span>
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
            <span class="text-muted ps-2 pt-1 text-sm">{{ scale }}%</span>
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
        class="main-container relative z-0 flex h-full w-full flex-1 flex-nowrap items-center justify-center"
        :style="{ transform: `scale(${scale / 100})` }"
      >
        <div
          class="inner-container absolute flex h-117.5 w-full items-center gap-6"
        >
          <div
            class="left-side relative flex h-full w-full max-w-[36%] items-center justify-center"
          >
            <template v-for="(model, index) in models" :key="`top-${model.id}`">
              <div class="absolute flex w-full pointer-events-none">
                <svg
                  v-if="!isHidden(model.id)"
                  :viewBox="`0 0 ${model.viewbox_width_top} ${model.viewbox_height_top}`"
                  class="max-h-full w-auto"
                  :class="
                    hoveredModelId !== null && hoveredModelId === model.id
                      ? 'z-10'
                      : ''
                  "
                  :style="{ height: `${model.viewbox_height_top}px` }"
                >
                  <path
                    :d="model.path_top"
                    fill="transparent"
                    :stroke="colors[index % colors.length]"
                    :stroke-width="thickness / 10"
                    class="[transition:transform_0.4s_cubic-bezier(0.4,0,0.2,1),transform-origin_0.4s_cubic-bezier(0.4,0,0.2,1)]"
                    vector-effect="non-scaling-stroke"
                    :style="{
                      transformOrigin: getTransformOrigin(),
                      transformBox: 'fill-box',
                      opacity:
                        hoveredModelId !== null && hoveredModelId !== model.id
                          ? 0.2
                          : 1,
                    }"
                  />
                </svg>
              </div>
            </template>
          </div>
          <div
            class="right-side aspect-square relative flex h-full w-full items-end justify-center"
          >
            <template
              v-for="(model, index) in models"
              :key="`side-${model.id}`"
            >
              <div class="absolute flex w-full pointer-events-none">
                <svg
                  v-if="!isHidden(model.id)"
                  :viewBox="`0 0 ${model.viewbox_width_side} ${model.viewbox_height_side}`"
                  class="h-auto max-w-full"
                  :class="
                    hoveredModelId !== null && hoveredModelId === model.id
                      ? 'z-10'
                      : ''
                  "
                  :style="{ width: `${model.viewbox_width_side}px` }"
                >
                  <path
                    :d="model.path_side"
                    fill="transparent"
                    :stroke="colors[index % colors.length]"
                    :stroke-width="thickness / 10"
                    vector-effect="non-scaling-stroke"
                    class="[transition:transform_0.4s_cubic-bezier(0.4,0,0.2,1),transform-origin_0.4s_cubic-bezier(0.4,0,0.2,1)]"
                    :style="{
                      transformOrigin: getTransformOrigin(),
                      transformBox: 'fill-box',
                      opacity:
                        hoveredModelId !== null && hoveredModelId !== model.id
                          ? 0.2
                          : 1,
                    }"
                  />
                </svg>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
