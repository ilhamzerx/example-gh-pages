<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Processing login...</h1>
      <p class="text-gray-600 mb-8">Please wait while we authenticate your account</p>
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { needsProfileCompletion, isLoading } from "../lib/auth";

const router = useRouter();

onMounted(async () => {
  // Wait for auth to initialize before proceeding with navigation
  if (isLoading.value) {
    let timeoutId: NodeJS.Timeout | null = null;
    await new Promise<void>((resolve) => {
      const checkLoading = () => {
        if (!isLoading.value) {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          resolve();
        } else {
          timeoutId = setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  // Check if we need to complete the profile
  if (needsProfileCompletion.value) {
    router.push("/complete-profile");
  } else {
    router.push("/");
  }
});
</script>
