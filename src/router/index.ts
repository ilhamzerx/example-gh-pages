import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn, isLoading, needsProfileCompletion } from '../lib/auth'

import HomePage from '../pages/MainPage.vue'
import JobDetailPage from '../pages/JobDetail.vue'
import AuthCallbackPage from '../pages/AuthCallback.vue'

const defaultTitle = 'Remote Jobs for Indonesian Talents'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta: {
        title: defaultTitle
      }
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: () => import('../pages/FAQ.vue'),
      meta: {
        title: 'Frequently Asked Questions | IDNRemote.com'
      }
    },
    {
      path: '/jobs/:id',
      name: 'JobDetail',
      component: JobDetailPage,
      meta: {
        title: 'Job Detail | IDNRemote.com'
      }
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: AuthCallbackPage,
      meta: {
        requiresAuth: true,
        renderWhenAuthLoading: true,
      }
    },
    {
      path: '/complete-profile',
      name: 'CompleteProfile',
      component: () => import('../pages/CompleteProfile.vue'),
      meta: {
        requiresAuth: true,
        title: 'Complete Your Profile | IDNRemote.com'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../pages/Profile.vue'),
      meta: {
        requiresAuth: true,
        title: 'Profile | IDNRemote.com'
      }
    },
    // Fallback route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/NotFound.vue')
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, _, next) => {
  document.title = to.meta.title as string || defaultTitle;

  // We should handle loading auth in that pages
  if (to.meta.requiresAuth && to.meta.renderWhenAuthLoading) {
    return next()
  }

  // Wait for auth to initialize before proceeding with navigation
  if (isLoading.value && to.meta.requiresAuth) {
    let timeoutId: NodeJS.Timeout | null = null
    await new Promise<void>(resolve => {
      const checkLoading = () => {
        if (!isLoading.value) {
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }
          resolve()
        } else {
          timeoutId = setTimeout(checkLoading, 100)
        }
      }
      checkLoading()
    })
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    // redirect to home page
    return next('/')
  }
  
  // If logged in, profile not complete and access required auth, redirect to complete profile
  // except if already heading there or to auth callback
  if (
    isLoggedIn.value && 
    needsProfileCompletion.value && 
    to.meta.requiresAuth &&
    to.name !== 'CompleteProfile' && 
    to.name !== 'AuthCallback'
  ) {
    return next('/complete-profile')
  }
  
  next()
})

export default router
