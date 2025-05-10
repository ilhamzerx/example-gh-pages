<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img
            :src="formData.profile_picture || '/assets/images/default-avatar.svg'"
            alt="Profile Picture"
            class="h-24 w-24 rounded-full object-cover"
            @error="handleImageError"
          />
        </div>
        <h1 class="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p class="text-gray-600">
          Please provide some additional information to complete your registration
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="fullname" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="fullname"
            v-model="formData.email"
            type="text"
            disabled
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
          />
        </div>

        <div>
          <label for="fullname" class="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="fullname"
            v-model="formData.fullname"
            type="text"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="nickname" class="block text-sm font-medium text-gray-700">
            Nickname
          </label>
          <input
            id="nickname"
            v-model="formData.nickname"
            type="text"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="whatsappNumber" class="block text-sm font-medium text-gray-700">
            WhatsApp Number
          </label>
          <div class="relative">
            <input
              id="whatsappNumber"
              v-model="formData.whatsapp_number"
              type="text"
              required
              pattern="\+[0-9]+"
              placeholder="e.g. +62812345678"
              class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{
                'border-red-500': whatsappError,
                'border-gray-300': !whatsappError,
              }"
              @input="validateWhatsapp"
            />
            <p v-if="whatsappError" class="text-red-500 text-sm mt-1">
              WhatsApp number must start with "+" followed by numbers
            </p>
          </div>
        </div>

        <div>
          <label for="currentJob" class="block text-sm font-medium text-gray-700">
            Current Job
          </label>
          <input
            id="currentJob"
            v-model="formData.current_job"
            type="text"
            required
            placeholder="e.g. Software Engineer"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Tag preferences input -->
        <div>
          <TagInput
            v-model="selectedTags"
            :available-tags="availableTags"
            :is-loading="isLoadingTags"
            label="Skills and Interests"
            placeholder="Type to search for skills and interests..."
            @search="searchTags"
          />
          <p class="mt-1 text-xs text-gray-500">
            Add your skills and interests to help us find relevant job opportunities for
            you.
          </p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="submit"
            :disabled="isLoadingSubmit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              v-if="isLoadingSubmit"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { updateUserData, currentUser, getAccessToken } from "../lib/auth";
import { getAvailableTags, saveUserProfile } from "../api/profile";
import type { Tag, User } from "@/types/model";
import TagInput from "@/components/Tag/TagInput.vue";
import { showSuccessToast, showErrorToast } from "@/lib/notification";
import { handleImageError } from "@/lib/utils";
import { getNowUnix } from "@/lib/time";

const router = useRouter();
const isLoadingSubmit = ref(false);
const formData = ref({
  email: "",
  fullname: "",
  nickname: "",
  whatsapp_number: "",
  current_job: "",
  profile_picture: "",
});
const whatsappError = ref(false);

// Tag-related state
const availableTags = ref<Tag[]>([]);
const selectedTags = ref<Tag[]>([]);
const isLoadingTags = ref(false);

const incompleteUser = computed<User>(() => {
  return currentUser.value!;
});

onMounted(async () => {
  try {
    if (!incompleteUser.value) {
      router.push("/");
      return;
    }

    formData.value = {
      email: incompleteUser.value.email,
      fullname: incompleteUser.value.fullname,
      nickname: incompleteUser.value.nickname,
      whatsapp_number: incompleteUser.value.whatsapp_number,
      current_job: incompleteUser.value.current_job,
      profile_picture: incompleteUser.value.profile_picture || "",
    };

    // Fetch available tags
    isLoadingTags.value = true;
    const tags = await getAvailableTags();
    availableTags.value = tags;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoadingTags.value = false;
  }
});

const validateWhatsapp = () => {
  const pattern = /^\+[0-9]+$/;
  whatsappError.value = !pattern.test(formData.value.whatsapp_number);
};

// Handle tag search
const searchTags = async (query: string) => {
  if (!query) return;

  try {
    isLoadingTags.value = true;
    // For now, we'll filter locally
  } catch (error) {
    console.error("Error searching tags:", error);
  } finally {
    isLoadingTags.value = false;
  }
};

const handleSubmit = async () => {
  try {
    const accessToken = getAccessToken.value;
    if (!accessToken) {
      router.push("/");
      return;
    }

    if (selectedTags.value.length < 1) {
      showErrorToast(
        "Unable to complete profile",
        "Please select at least one skill or interest"
      );
      return;
    }

    isLoadingSubmit.value = true;

    // Save user profile data
    const user = {
      fullname: formData.value.fullname,
      nickname: formData.value.nickname,
      profile_picture: formData.value.profile_picture,
      current_job: formData.value.current_job,
      whatsapp_number: formData.value.whatsapp_number,
      preferences_tags: selectedTags.value.map((tag) => tag.name),
    };
    const ok = await saveUserProfile(accessToken, user);

    if (!ok) {
      showErrorToast(
        "Opps, something went wrong while saving your profile",
        "Please try again later or contact us."
      );
      throw new Error("Failed to save user profile");
    }

    // Update local user state
    updateUserData({
      ...user,
      id: incompleteUser.value.id,
      email: formData.value.email,
      created_at: incompleteUser.value.created_at,
      updated_at: getNowUnix(),
    });

    // Show success toast
    showSuccessToast("Successfully completed profile", "Welcome to IDNRemote!");

    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (error) {
    console.error("Error completing profile:", error);
  } finally {
    isLoadingSubmit.value = false;
  }
};
</script>
