<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed z-50 bottom-4 right-4 max-w-full min-w-96 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      :class="typeClasses"
    >
      <div class="p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg
              v-if="type === 'success'"
              class="h-6 w-6 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Error Icon -->
            <svg
              v-else-if="type === 'error'"
              class="h-6 w-6 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>

            <!-- Info Icon -->
            <svg
              v-else
              class="h-6 w-6 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ title }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="closeToast"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  show: boolean;
  type?: "success" | "error" | "info";
  title?: string;
  message: string;
  duration?: number;
}>();

const emit = defineEmits(["close"]);

const localShow = ref(props.show);

// Watch for changes to the show prop
watch(
  () => props.show,
  (newVal) => {
    localShow.value = newVal;
    if (newVal && props.duration) {
      setTimeout(() => {
        closeToast();
      }, props.duration);
    }
  }
);

// Determine classes based on toast type
const typeClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "border-l-4 border-green-500";
    case "error":
      return "border-l-4 border-red-500";
    case "info":
    default:
      return "border-l-4 border-blue-500";
  }
});

const closeToast = () => {
  localShow.value = false;
  emit("close");
};
</script>
