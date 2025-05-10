<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchJobs } from "@/api/jobs";
import { humanizeTime } from "@/lib/time";
import type { Job } from "@/types/model";
import TagList from "@/components/Tag/TagList.vue";

const jobs = ref<Job[]>([]);
const searchQuery = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

const trustedCompanies = [
  { name: "Nabitu", logo: "/assets/images/nabitu.png" },
  { name: "Aqar", logo: "/assets/images/aqar.svg" },
  { name: "Haraj", logo: "/assets/images/haraj.png" },
  { name: "Zero Gravity", logo: "/assets/images/zero.svg" },
];

const loadJobs = async (query?: string) => {
  loading.value = true;
  try {
    jobs.value = await fetchJobs(query);
  } catch (error) {
    console.error("Failed to load jobs:", error);
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  loadJobs(searchQuery.value);
};

onMounted(() => {
  loadJobs();
});
</script>

<style>
.grayscale-logo {
  filter: grayscale(100%);
  opacity: 0.7;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.grayscale-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
}
</style>

<template>
  <div class="mx-auto">
    <div
      class="bg-[url('/assets/images/bg.png')] bg-repeat bg-blue-50 w-full text-center py-20 px-4"
    >
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-poppins font-semibold mb-4">
        The <span class="text-blue-600">Largest Remote Job Board</span>
        <br />
        for Indonesian Digital Talents
      </h1>
      <p class="text-gray-600 text-sm md:text-base">
        Find your dream job from our hand-picked remote jobs that are 100% for Indonesian
        talents
      </p>
    </div>

    <div class="py-7 mb-8 text-center bg-gray-50">
      <p class="text-md font-semibold mb-4">Trusted by Global Companies</p>
      <div
        class="flex justify-center md:space-x-8 gap-8 mx-auto max-w-2xl px-4 flex-wrap items-center"
      >
        <img
          v-for="company in trustedCompanies"
          :key="company.name"
          :src="company.logo"
          :alt="company.name"
          class="h-7 grayscale-logo"
        />
      </div>
    </div>

    <div class="mb-5 mx-auto max-w-2xl px-4">
      <h2 class="text-md font-semibold mb-4">Latest Job Openings</h2>
      <div class="relative flex space-x-2 items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search jobs by title, company name, or location..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="onSearch"
        />
        <button
          @click="onSearch"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
    </div>

    <div v-if="loading" class="mb-8 mx-auto max-w-2xl px-4">
      <div class="space-y-4">
        <!-- Featured Skeleton Loading -->
        <div
          v-for="i in 2"
          :key="i"
          class="p-4 h-32 rounded-lg border border-gray-100 border-l-4 border-l-blue-500 bg-blue-50 animate-pulse"
        />

        <!-- Regular Skeleton Loading -->
        <div
          v-for="i in 2"
          :key="i"
          class="p-4 h-32 rounded-lg border border-gray-100 bg-gray-100 animate-pulse"
        />
      </div>
    </div>

    <div v-else-if="error" class="mb-8 mx-auto max-w-2xl px-4 text-center py-8">
      <div class="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-red-500 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="text-red-600 font-medium mb-4">{{ error }}</p>
        <p class="text-gray-600 mb-4">
          We couldn't load the job listings. Please try again.
        </p>
        <button
          @click="loadJobs()"
          class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
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

    <div v-else-if="jobs.length === 0" class="mb-8 mx-auto max-w-2xl px-4 text-center">
      <p>No jobs found. Please try a different search term or check back later.</p>
    </div>

    <div v-else class="mb-8 mx-auto max-w-2xl px-4">
      <div class="space-y-4">
        <router-link
          v-for="job in jobs"
          :key="job.id"
          :to="{
            name: 'JobDetail',
            params: { id: job.id },
          }"
          class="block"
        >
          <div
            :class="[
              'p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow',
              job.is_featured ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'bg-gray-100',
            ]"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ job.job_title }}</h3>
                <p class="text-gray-600">
                  {{ job.company_name }} • {{ job.company_location }}
                </p>
              </div>
            </div>
            <TagList :tags="job.relevant_tags" :isFeatured="job.is_featured" />
            <p class="text-gray-500 text-sm mt-4">
              Posted {{ humanizeTime(job.created_at) }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
