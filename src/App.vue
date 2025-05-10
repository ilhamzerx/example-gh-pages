<script setup lang="ts">
import { onMounted, computed } from "vue";
import Navbar from "./components/Navbar/Navbar.vue";
import Footer from "./components/Footer/Footer.vue";
import { initAuth, isLoading, setSession } from "./lib/auth";
import { supabase } from "./lib/supabase";
import { useRoute } from "vue-router";
import Toast from "@/components/Toast/Toast.vue";
import { toast, hideToast } from "@/lib/notification";

const route = useRoute();

// Check if the route requires authentication
const renderWhenAuthLoading = computed(() => Boolean(route.meta.renderWhenAuthLoading));
const requiresAuth = computed(() => Boolean(route.meta.requiresAuth));

// Initialize authentication when the app starts
onMounted(async () => {
  // Initialize auth state
  await initAuth();

  // Set up auth state change listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      setSession(session);
    }
  });
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Toast
      :show="toast.show"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      @close="hideToast"
    />
    <Navbar />
    <div class="flex-grow">
      <!-- Show loading indicator while auth is initializing -->
      <div
        v-if="isLoading && requiresAuth && !renderWhenAuthLoading"
        class="flex items-center justify-center min-h-[60vh]"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      <router-view v-else />
    </div>
    <Footer />
  </div>
</template>
