<template>
  <!-- Loading Skeleton -->
  <div v-if="loading" class="min-h-[calc(100vh-64px)] mx-auto pt-6 bg-gray-100">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Breadcrumb Skeleton -->
      <div class="flex items-center gap-2 mb-6">
        <div class="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        <div class="text-gray-300">/</div>
        <div class="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
      </div>

      <!-- Title Skeleton -->
      <div class="h-10 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
      <!-- Company Info Skeleton -->
      <div class="flex flex-wrap items-center mb-4">
        <div class="h-6 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
      </div>
      <!-- Tags Skeleton -->
      <div class="flex flex-wrap gap-2 mb-8">
        <div class="h-6 bg-gray-200 rounded-md w-20 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded-md w-16 animate-pulse"></div>
      </div>
      <!-- Date Skeleton -->
      <div class="h-4 bg-gray-200 rounded-md w-20 animate-pulse"></div>
    </div>

    <!-- Description Skeleton -->
    <div class="max-w-4xl mx-auto p-6">
      <div class="space-y-6">
        <div class="h-10 bg-gray-200 rounded-md w-full animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded-md w-full animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
        <div class="h-10 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
      </div>
    </div>

    <!-- Button Skeleton -->
    <div class="max-w-4xl mx-auto p-6 pt-0">
      <div class="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="min-h-[calc(100vh-64px)] flex items-center justify-center"
  >
    <div class="max-w-md w-full p-6 text-center">
      <img src="/assets/images/404.svg" alt="404" class="mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ error }}</h2>
      <p class="text-gray-600 mb-4">Please check the URL or try again later.</p>
      <button
        @click="loadJob()"
        class="flex items-center gap-2 mx-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Try Again</span>
      </button>
    </div>
  </div>

  <!-- Job Details -->
  <div v-else-if="job" class="">
    <div :class="['mx-auto pt-6', job.is_featured ? 'bg-blue-50' : 'bg-gray-100']">
      <div class="max-w-4xl mx-auto p-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 mb-6 text-sm">
          <router-link to="/" class="text-blue-500 hover:underline">Home</router-link>
          <span class="text-gray-500">/</span>
          <span class="text-gray-700">Job</span>
        </nav>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ job.job_title }}</h1>
        <div class="flex flex-wrap items-center text-lg mb-4">
          <span>{{ job.company_name }}</span>
          <span class="mx-2">•</span>
          <span>{{ job.company_location }}</span>
        </div>
        <TagList
          class="mb-2"
          :tags="job.relevant_tags"
          :isFeatured="job.is_featured"
          :showMore="true"
        />
        <span class="text-gray-600">Posted {{ humanizeTime(job.created_at) }}</span>
      </div>
    </div>

    <!-- Job Description -->
    <div class="max-w-4xl mx-auto p-6">
      <p class="mb-6 whitespace-pre-wrap">{{ job.short_description }}</p>
    </div>

    <!-- Apply Button -->
    <div class="max-w-4xl mx-auto p-6 pt-0">
      <a
        :href="job.apply_url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Apply Now
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Job } from "@/types/model";
import { fetchJobById } from "@/api/jobs";
import { humanizeTime } from "@/lib/time";
import TagList from "@/components/Tag/TagList.vue";

const route = useRoute();
const jobId = route.params.id as string;
const job = ref<Job | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const loadJob = async () => {
  if (!jobId) {
    error.value = "Job ID not found";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const jobData = await fetchJobById(jobId);
    if (!jobData) {
      throw new Error("Job not found");
    }
    job.value = jobData;

    // Set document title based on loaded job data
    document.title = `${jobData.job_title} at ${jobData.company_name} | IDNRemote.com`;
  } catch (e) {
    error.value = "Job not found";
    console.error("Error loading job:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  loadJob();
});
</script>
