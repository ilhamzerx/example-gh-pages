<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <!-- Input with selected tag pills -->
    <div
      class="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-10 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
      :class="{ 'border-red-500': error }"
    >
      <!-- Selected tags displayed as pills -->
      <div
        v-for="tag in modelValue"
        :key="tag.id"
        class="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md"
      >
        <span>{{ tag.name }}</span>
        <button
          type="button"
          class="ml-1 text-blue-600 hover:text-blue-800"
          @click="removeTag(tag)"
        >
          &times;
        </button>
      </div>

      <!-- Text input for new tags -->
      <input
        :id="id"
        v-model="inputValue"
        type="text"
        class="flex-grow outline-none border-0 p-0 focus:ring-0 min-w-20"
        :placeholder="modelValue.length ? 'Add more tags...' : placeholder"
        pattern="^[a-zA-Z0-9_ ]*$"
        :disabled="disabled"
        @focus="isFocused = true"
        @blur="onBlur"
        @input="debouncedSearch"
        @keydown.backspace="handleBackspace"
        @keydown.enter.prevent="handleEnter"
        @keydown.down.prevent="focusNextSuggestion"
        @keydown.up.prevent="focusPreviousSuggestion"
      />
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>

    <!-- Minimum tags validation message -->
    <p v-if="!error && validationMessage" class="mt-1 text-sm text-amber-600">
      {{ validationMessage }}
    </p>

    <!-- Loading indicator -->
    <p v-if="isLoading" class="mt-1 text-sm text-gray-500">Loading tags...</p>

    <!-- Dropdown with tag suggestions -->
    <div
      v-if="
        isFocused && (filteredSuggestions.length > 0 || initialSuggestions.length > 0)
      "
      class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <ul class="py-1">
        <li
          v-for="(suggestion, index) in inputValue
            ? filteredSuggestions
            : initialSuggestions"
          :key="suggestion.id"
          :class="[
            'px-3 py-2 cursor-pointer hover:bg-gray-100',
            { 'bg-gray-100': focusedIndex === index },
          ]"
          @mousedown.prevent="selectTag(suggestion)"
          @mouseover="focusedIndex = index"
        >
          {{ suggestion.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Tag } from "@/types/model";
import { debounce } from "@/lib/utils";

// Component props
const props = defineProps({
  modelValue: {
    type: Array as () => Tag[],
    required: true,
  },
  availableTags: {
    type: Array as () => Tag[],
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Tags",
  },
  placeholder: {
    type: String,
    default: "Type to search for tags...",
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: "tag-input",
  },
  minTags: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

// Local state
const inputValue = ref("");
const isFocused = ref(false);
const focusedIndex = ref(-1);
const userInteracted = ref(false);

// Computed properties
const filteredSuggestions = computed(() => {
  if (!inputValue.value.trim()) return [];

  // Filter available tags that match the input and aren't already selected
  const query = inputValue.value.toLowerCase().trim();
  return props.availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(query) &&
      !props.modelValue.some((selectedTag) => selectedTag.id === tag.id)
  );
});

const initialSuggestions = computed(() => {
  return props.availableTags.filter(
    (tag) => !props.modelValue.some((selectedTag) => selectedTag.id === tag.id)
  );
});

const tagCount = computed(() => props.modelValue.length);
const isBelowMinimum = computed(() => tagCount.value < props.minTags);
const validationMessage = computed(() => {
  if (userInteracted.value && isBelowMinimum.value) {
    return `Please select at least ${props.minTags} tag${props.minTags !== 1 ? "s" : ""}`;
  }
  return "";
});

// Create debounced search function
const debouncedSearch = debounce(() => {
  emit("search", inputValue.value);
  focusedIndex.value = -1;
}, 300);

// Methods
const selectTag = (tag: Tag) => {
  userInteracted.value = true;
  const updatedValue = [...props.modelValue, tag];
  emit("update:modelValue", updatedValue);
  inputValue.value = "";
  focusedIndex.value = -1;
};

const removeTag = (tagToRemove: Tag) => {
  userInteracted.value = true;
  const updatedValue = props.modelValue.filter((tag) => tag.id !== tagToRemove.id);
  emit("update:modelValue", updatedValue);
};

const handleBackspace = () => {
  // Remove last tag when pressing backspace on empty input
  if (inputValue.value === "" && props.modelValue.length > 0) {
    userInteracted.value = true;
    removeTag(props.modelValue[props.modelValue.length - 1]);
  }
};

const handleEnter = () => {
  // Select the focused tag or create a custom one
  if (focusedIndex.value >= 0 && filteredSuggestions.value.length > 0) {
    selectTag(filteredSuggestions.value[focusedIndex.value]);
  }
};

const focusNextSuggestion = () => {
  if (filteredSuggestions.value.length === 0) return;
  focusedIndex.value = (focusedIndex.value + 1) % filteredSuggestions.value.length;
};

const focusPreviousSuggestion = () => {
  if (filteredSuggestions.value.length === 0) return;
  focusedIndex.value =
    (focusedIndex.value - 1 + filteredSuggestions.value.length) %
    filteredSuggestions.value.length;
};

const onBlur = () => {
  // Delay hiding the suggestions to allow for mousedown events to complete
  setTimeout(() => {
    isFocused.value = false;
    focusedIndex.value = -1;
  }, 200);
};

// Reset search when selected tags change
watch(
  () => props.modelValue,
  () => {
    if (inputValue.value) {
      debouncedSearch();
    }
  }
);
</script>
