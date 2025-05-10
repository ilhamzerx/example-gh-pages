<template>
  <div>
    <div class="bg-gray-100">
      <div class="mx-auto max-w-4xl p-6">
        <h2 class="text-lg leading-6 font-medium text-gray-900">User Profile</h2>
        <p class="mt-1 text-sm text-gray-500">
          Your personal information and preferences
        </p>
        <div class="flex justify-center my-4">
          <img
            v-if="!isLoading"
            :src="profileData.profile_picture || '/assets/images/default-avatar.svg'"
            alt="Profile Picture"
            class="h-24 w-24 rounded-full object-cover"
          />
          <div
            v-if="isLoading"
            class="animate-pulse h-24 w-24 rounded-full bg-gray-200"
          ></div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 max-w-4xl mx-auto p-6">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                v-if="!isLoading"
                id="email"
                v-model="profileData.email"
                type="email"
                disabled
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              />
              <div v-else class="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
              <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>

          <div>
            <label for="fullname" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div class="mt-1">
              <input
                v-if="!isLoading"
                :disabled="isSaving"
                id="fullname"
                v-model="profileData.fullname"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              />
              <div v-else class="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div>
            <label for="nickname" class="block text-sm font-medium text-gray-700">
              Nickname
            </label>
            <div class="mt-1">
              <input
                v-if="!isLoading"
                :disabled="isSaving"
                id="nickname"
                v-model="profileData.nickname"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              />
              <div v-else class="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div>
            <label for="whatsapp_number" class="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <div class="mt-1">
              <input
                v-if="!isLoading"
                :disabled="isSaving"
                id="whatsapp_number"
                v-model="profileData.whatsapp_number"
                type="text"
                placeholder="e.g. +62812345678"
                pattern="\+[0-9]+"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              />
              <div v-else class="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div>
            <label for="current_job" class="block text-sm font-medium text-gray-700">
              Current Job
            </label>
            <div class="mt-1">
              <input
                v-if="!isLoading"
                :disabled="isSaving"
                id="current_job"
                v-model="profileData.current_job"
                type="text"
                placeholder="e.g. Software Engineer"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              />
              <div v-else class="animate-pulse h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <!-- Tag preferences input -->
          <div v-if="!isLoading">
            <TagInput
              v-model="selectedTags"
              :disabled="isSaving"
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
          <div v-else class="animate-pulse h-20 w-full bg-gray-200 rounded-md"></div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSaving || !hasChanges"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving" class="mr-2">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
              ></div>
            </span>
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>

      <div v-if="successMessage" class="mt-4 p-4 rounded-md bg-green-50 text-green-700">
        {{ successMessage }}
      </div>

      <div
        v-if="errorMessage"
        class="mt-4 p-4 rounded-md bg-red-50 text-red-700 white-space-pre-wrap"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { updateUserData, currentUser, isLoading, getAccessToken } from "../lib/auth";
import { getAvailableTags, saveUserProfile } from "../api/profile";
import type { User, Tag } from "../types/model";
import TagInput from "../components/Tag/TagInput.vue";
import { getNowUnix } from "@/lib/time";

const profileData = ref<User>({
  id: "",
  email: "",
  fullname: "",
  nickname: "",
  profile_picture: "",
  current_job: "",
  whatsapp_number: "",
  preferences_tags: [],
  created_at: 0,
  updated_at: 0,
});

const originalProfileData = ref<User | null>(null);
const isSaving = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Tag-related state
const availableTags = ref<Tag[]>([]);
const selectedTags = ref<Tag[]>([]);
const originalSelectedTags = ref<Tag[]>([]);
const isLoadingTags = ref(false);

const hasChanges = computed(() => {
  if (!profileData.value) return false;
  if (!originalProfileData.value) return false;

  // Check if basic profile fields have changed
  const profileChanged =
    profileData.value.fullname !== originalProfileData.value.fullname ||
    profileData.value.nickname !== originalProfileData.value.nickname ||
    profileData.value.whatsapp_number !== originalProfileData.value.whatsapp_number ||
    profileData.value.current_job !== originalProfileData.value.current_job ||
    profileData.value.profile_picture !== originalProfileData.value.profile_picture;

  // Check if tags have changed
  const tagsChanged =
    JSON.stringify(selectedTags.value.map((t) => t.id).sort()) !==
    JSON.stringify(originalSelectedTags.value.map((t) => t.id).sort());

  return profileChanged || tagsChanged;
});

onMounted(async () => {
  try {
    // Set profile data
    profileData.value = { ...currentUser.value! };
    originalProfileData.value = { ...currentUser.value! };

    // Fetch available tags
    isLoadingTags.value = true;
    const allTags = await getAvailableTags();

    const tagsMap = new Map(allTags.map((tag) => [tag.name, tag]));
    const userTags = currentUser
      .value!.preferences_tags.map((tagName) => {
        const tag = tagsMap.get(tagName);
        if (tag) {
          return tag;
        } else {
          console.warn(`Tag "${tagName}" not found in available tags.`);
          return null;
        }
      })
      .filter((tag) => tag !== null) as Tag[];

    // Set tags
    selectedTags.value = [...userTags];
    originalSelectedTags.value = [...userTags];
    availableTags.value = allTags;
  } catch (error) {
    console.error("Error loading data:", error);
    errorMessage.value =
      "Opps, something went wrong while getting the list of tags.\nPlease try again later or contact us.";
  } finally {
    isLoadingTags.value = false;
  }
});

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

const updateProfile = async () => {
  const prefTags = selectedTags.value.map((tag) => tag.name);
  if (prefTags.length === 0) {
    errorMessage.value = "Please select at least one tag.";
    return;
  }

  try {
    isSaving.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    // Save user profile data
    let user = {
      fullname: profileData.value.fullname,
      nickname: profileData.value.nickname,
      profile_picture: profileData.value.profile_picture,
      whatsapp_number: profileData.value.whatsapp_number,
      current_job: profileData.value.current_job,
      preferences_tags: prefTags,
    };
    const ok = await saveUserProfile(getAccessToken.value!, user);
    if (!ok) {
      errorMessage.value =
        "Opps, something went wrong while updating your profile.\nPlease try again later or contact us.";
      return;
    }

    // Update local user state and references
    const updatedUser = {
      ...user,
      id: profileData.value.id,
      email: profileData.value.email,
      created_at: profileData.value.created_at,
      updated_at: getNowUnix(),
    };
    updateUserData(updatedUser);
    originalProfileData.value = { ...updatedUser };
    originalSelectedTags.value = [...selectedTags.value];

    successMessage.value = "Profile updated successfully!";
  } catch (error) {
    console.error("Error updating profile:", error);
    errorMessage.value =
      "Opps, something went wrong while updating your profile.\nPlease try again later or contact us.";
  } finally {
    isSaving.value = false;
  }
};
</script>
