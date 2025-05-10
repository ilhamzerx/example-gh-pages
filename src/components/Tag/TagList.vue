<template>
  <div :class="['flex', 'flex-wrap', 'gap-2', 'mb-6', className]">
    <!-- Featured tag -->
    <span v-if="isFeatured" class="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded">
      Featured
    </span>

    <!-- Regular tags -->
    <span
      v-for="(tag, index) in tagsToShow"
      :key="`tag-${index}`"
      class="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded"
    >
      {{ tag }}
    </span>

    <!-- More indicator if needed -->
    <span
      v-if="hasMoreTags && !showMore"
      class="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded"
    >
      +{{ remainingTagsCount }} more
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
  showMore: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: "",
  },
});

const tagsToShow = computed(() => {
  if (props.showMore) {
    return props.tags;
  }

  const maxTotalTags = 4;
  const maxRegularTags = maxTotalTags - (props.isFeatured ? 1 : 0);
  return props.tags.slice(0, maxRegularTags);
});

const hasMoreTags = computed(() => props.tags.length > tagsToShow.value.length);

const remainingTagsCount = computed(() => props.tags.length - tagsToShow.value.length);
</script>
