import { computed, ref } from "vue";
import {
  signInWithGoogle,
  signOut as authSignOut,
  getSession,
} from "../api/auth";
import { getUserProfile } from "../api/profile";
import type { User, Session } from "../types/model";

// Create reactive state
const user = ref<User | null>(null);
const session = ref<Session | null>(null);
const loading = ref(false);

// Init auth state from stored session
export const initAuth = async () => {
  try {
    loading.value = true;
    // Check if we have a session in Supabase
    const currentSession = await getSession();

    if (currentSession === null) {
      user.value = null;
      return;
    }

    // Set session state
    session.value = currentSession;

    const profile = await getUserProfile(session.value.access_token);
    user.value = profile;
  } catch (error) {
    console.error("Error initializing auth:", error);
    user.value = null;
    session.value = null;
  } finally {
    loading.value = false;
  }
};

// Sign in with Google
export const loginWithGoogle = async () => {
  try {
    const { url } = await signInWithGoogle();
    // Redirect to Google OAuth page
    if (url) window.location.href = url;
  } catch (error) {
    console.error("Error in Google login:", error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await authSignOut();
    session.value = null;
    user.value = null;
  } catch (error) {
    console.error("Error in logout:", error);
    throw error;
  }
};

// Computed properties for auth state
export const currentUser = computed<User | null>(() => {
  if (user.value) {
    return user.value;
  }

  return session.value?.user || null;
});
export const isLoggedIn = computed(() => !!currentUser.value);
export const isLoading = computed(() => loading.value);
export const getAccessToken = computed(() => {
  if (session.value) {
    return session.value.access_token;
  }
  return null;
});

// Check if user needs to complete profile
export const needsProfileCompletion = computed(() => {
  return (
    !user.value?.id ||
    !user.value?.fullname ||
    !user.value?.nickname ||
    !user.value?.whatsapp_number ||
    !user.value?.current_job
  );
});

// Update user data in local state
export const updateUserData = (newUserData: User) => {
  user.value = newUserData;
};

export const setSession = (newSession: any) => {
  session.value = newSession;
};
