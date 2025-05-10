<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  isLoading,
  isLoggedIn,
  currentUser,
  logout,
  loginWithGoogle,
} from "../../lib/auth";
import { handleImageError } from "../../lib/utils";

const router = useRouter();
const isMenuOpen = ref(false);
const isLoadingSignIn = ref(false);

const handleLogout = async () => {
  try {
    await logout();
    router.push("/");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const handleGoogleSignIn = async () => {
  try {
    isLoadingSignIn.value = true;
    await loginWithGoogle();
    // The redirect to Google's OAuth page is handled in the loginWithGoogle function
  } catch (error) {
    console.error("Error signing in with Google:", error);
  } finally {
    isLoadingSignIn.value = false;
  }
};
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link
            to="/"
            class="text-md md:text-xl font-poppins font-semibold text-blue-600"
          >
            IDNRemote.com
          </router-link>
        </div>

        <!-- Nav Items -->
        <div v-if="!isLoading" class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <!-- Auth buttons -->
          <template v-if="isLoggedIn">
            <div class="relative ml-3">
              <div>
                <button
                  @click="isMenuOpen = !isMenuOpen"
                  class="flex items-center text-sm rounded-full focus:outline-none"
                >
                  <span class="sr-only">Open user menu</span>
                  <!-- Use Avatar Image -->
                  <img
                    v-if="currentUser?.profile_picture"
                    :src="currentUser.profile_picture"
                    alt="Profile"
                    class="h-8 w-8 rounded-full object-cover"
                    @error="handleImageError"
                  />
                  <!-- Fallback to Initials -->
                  <div
                    v-else
                    class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold"
                  >
                    {{ currentUser?.nickname?.charAt(0).toUpperCase() || "U" }}
                  </div>
                  <span class="ml-2 text-gray-700">
                    {{ currentUser?.nickname || "User" }}
                  </span>
                </button>
              </div>

              <div
                v-if="isMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              >
                <router-link
                  :to="{
                    name: 'Profile',
                  }"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="isMenuOpen = false"
                >
                  Your Profile
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <button
              @click="handleGoogleSignIn"
              class="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none"
              :disabled="isLoadingSignIn"
            >
              <span v-if="isLoadingSignIn" class="mr-2">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                ></div>
              </span>
              <img
                v-else
                src="/assets/images/google.svg"
                alt="Google"
                class="w-4 h-4 mr-2"
              />
              Sign in with Google
            </button>
          </template>
        </div>

        <!-- Mobile menu button-->
        <div v-if="!isLoading" class="flex items-center sm:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <template v-if="isLoggedIn">
          <div class="border-t border-gray-200 pt-4 pb-3">
            <div class="px-4 flex items-center">
              <div class="flex-shrink-0">
                <!-- Use Avatar Image if Available -->
                <img
                  v-if="currentUser?.profile_picture"
                  :src="currentUser.profile_picture"
                  alt="Profile"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <!-- Fallback to Initials -->
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold"
                >
                  {{ currentUser?.nickname?.charAt(0).toUpperCase() || "U" }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">
                  {{ currentUser?.fullname }}
                </div>
                <div class="text-sm font-medium text-gray-500">
                  {{ currentUser?.nickname }}
                </div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <router-link
                :to="{
                  name: 'Profile',
                }"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                @click="isMenuOpen = false"
              >
                Your Profile
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="m-4">
            <button
              @click="handleGoogleSignIn"
              class="w-full flex justify-center items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
              :disabled="isLoadingSignIn"
            >
              <span v-if="isLoadingSignIn" class="mr-2">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                ></div>
              </span>
              <img
                v-else
                src="/assets/images/google.svg"
                alt="Google"
                class="w-4 h-4 mr-2"
              />
              Sign in with Google
            </button>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>
