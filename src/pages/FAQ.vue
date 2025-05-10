<template>
  <div>
    <div class="p-6 bg-gray-100">
      <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
      </div>
    </div>

    <div class="my-8 px-4 space-y-4 mx-auto max-w-4xl">
      <div v-for="(faq, index) in faqs" :key="index" class="border rounded-lg">
        <button
          @click="toggleFaq(index)"
          class="w-full px-6 py-4 text-left flex justify-between items-center"
          :aria-expanded="activeFaq === index"
        >
          <span class="font-medium">{{ faq.question }}</span>
          <span
            class="transform transition-transform duration-300"
            :class="{ 'rotate-180': activeFaq === index }"
          >
            ▼
          </span>
        </button>
        <div v-show="activeFaq === index" class="px-6 py-4 bg-gray-100">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const activeFaq = ref<number | null>(null);

const faqs = [
  {
    question: "What is IDN Remote?",
    answer:
      "IDN Remote is a platform that connects Indonesian tech talents with remote job opportunities from companies worldwide, enabling them to work remotely while staying in Indonesia.",
  },
  {
    question: "Where do you get the source for IDNRemote.com?",
    answer:
      "The source for IDNRemote.com is from community (crowdsourced) and our own database of remote jobs and companies. We also scrape job listings from major remote job boards and filter them to ensure they are suitable for Indonesian applicants.",
  },
  {
    question: "Are job listings in IDNRemote.com truly open for Indonesian applicants?",
    answer:
      "Yes, all job listings on IDNRemote.com are truly open for Indonesian applicants.",
  },
  {
    question: "Are job listings in IDNRemote.com all safe?",
    answer: "Yes, all job listings on IDNRemote.com are safe to apply with.",
  },
];

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
