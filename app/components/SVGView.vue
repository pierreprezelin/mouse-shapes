<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";
import type { Model } from "@/types/database";

const colors = ["#00C8FF", "#FF00EE", "#FFEA00", "#00FFC4", "#9E00FF"];

const thickness = ref(50);
const scale = ref(100);
const hiddenModels = ref(new Set<number>());
const hoveredModelId = ref<number | null>(null);

const props = defineProps<{
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

const mainContainer = ref<HTMLElement | null>(null);
const { width: containerWidth, height: containerHeight } =
  useElementSize(mainContainer);

const isReady = computed(
  () => containerWidth.value > 0 && containerHeight.value > 0,
);

const globalScaleFactor = computed(() => {
  if (!props.models?.length || !containerWidth.value) return 1;
  if (!isReady.value || !props.models?.length) return 0.1;

  const visibleModels = props.models.filter((m) => !isHidden(m.id));
  if (visibleModels.length === 0) return 1;

  const maxTopH = Math.max(...visibleModels.map((m) => m.viewbox_height_top));
  const maxSideH = Math.max(...visibleModels.map((m) => m.viewbox_height_side));
  const maxW = Math.max(
    ...visibleModels.map((m) =>
      Math.max(m.viewbox_width_top, m.viewbox_width_side),
    ),
  );

  const isMobile = containerWidth.value < 1024;

  const verticalLimit = containerHeight.value / Math.max(maxTopH, maxSideH);
  const horizontalLimit = containerWidth.value / 2 / maxW;

  return isMobile ? horizontalLimit : Math.min(verticalLimit, horizontalLimit);
});
</script>

<template>
  <section>
    <div
      class="flex h-[calc(100vh-var(--ui-header-height))] flex-col-reverse flex-nowrap gap-4 pb-4 lg:flex-row lg:gap-12"
    >
      <div
        class="relative z-2 flex h-full max-h-[50%] w-full flex-1 shrink-0 flex-col items-center justify-between gap-4 backdrop-blur-sm lg:max-h-full lg:max-w-92 lg:pt-18 lg:pb-0"
      >
        <div class="hidden lg:block"></div>
        <ul
          class="group max-h flex w-full flex-col gap-px overflow-y-auto lg:mt-8"
        >
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
              <div class="flex flex-col justify-center py-1">
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
        <UPopover>
          <UButton
            label="Settings"
            color="neutral"
            variant="subtle"
            icon="i-lucide-settings-2"
          />
          <template #content>
            <div class="settings min-w-56 p-6 pb-8">
              <span class="item-baseline mb-4 flex">
                Thickness
                <span class="text-muted ps-2 text-sm">
                  {{ thickness * 2 }}%
                </span>
              </span>
              <USlider
                v-model="thickness"
                :default-value="50"
                :min="0"
                :max="100"
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
              <!-- <span class="mt-6 mb-4 flex">Alignment</span>
              <USelect
                v-model="alignment"
                :items="
                  Object.entries(ALIGNMENT).map(([key, value]) => ({
                    label: value,
                    value: key,
                  }))
                "
                class="w-32 hover:cursor-pointer"
              /> -->
            </div>
          </template>
        </UPopover>
      </div>
      <div
        ref="mainContainer"
        class="main-container relative z-0 flex h-full w-full flex-1 flex-nowrap items-center justify-center pt-18"
        :style="{ transform: `scale(${scale / 100})` }"
      >
        <div
          class="inner-container flex w-full max-w-full items-center justify-center gap-4"
          :style="{ opacity: isReady ? 1 : 0 }"
        >
          <div
            class="left-side relative flex h-full w-full items-center justify-center"
          >
            <div
              :style="{
                transform: `scale(${(scale / 100) * globalScaleFactor})`,
                transformOrigin: 'center bottom',
              }"
              class="relative flex items-center justify-center"
            >
              <template
                v-for="(model, index) in models"
                :key="`top-${model.id}`"
              >
                <svg
                  v-if="!isHidden(model.id)"
                  :viewBox="`0 0 ${model.viewbox_width_top} ${model.viewbox_height_top}`"
                  class="absolute"
                  :class="
                    hoveredModelId !== null && hoveredModelId === model.id
                      ? 'z-10'
                      : ''
                  "
                  :style="{
                    width: `${model.viewbox_width_top}px`,
                    height: `${model.viewbox_height_top}px`,
                  }"
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
              </template>
            </div>
          </div>
          <div
            class="right-side relative flex aspect-square h-full w-full items-end justify-center"
          >
            <div
              :style="{
                transform: `scale(${(scale / 100) * globalScaleFactor})`,
                transformOrigin: 'center bottom',
              }"
              class="relative flex items-end justify-center"
            >
              <template
                v-for="(model, index) in models"
                :key="`side-${model.id}`"
              >
                <svg
                  v-if="!isHidden(model.id)"
                  :viewBox="`0 0 ${model.viewbox_width_side} ${model.viewbox_height_side}`"
                  class="absolute"
                  :class="
                    hoveredModelId !== null && hoveredModelId === model.id
                      ? 'z-10'
                      : ''
                  "
                  :style="{
                    width: `${model.viewbox_width_side}px`,
                    height: `${model.viewbox_height_side}px`,
                  }"
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
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
