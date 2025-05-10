<template>
  <div
    class="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <img
        src="/assets/images/404.svg"
        alt="Page not found"
        class="mx-auto h-40 w-auto"
      />
      <h1 class="mt-6 text-3xl font-extrabold text-gray-900">Page not found</h1>
      <p class="mt-2 text-base text-gray-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div class="mt-5">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Go back home
        </router-link>
      </div>
    </div>
  </div>
</template>
