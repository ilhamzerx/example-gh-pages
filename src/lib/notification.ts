import { ref } from 'vue';

// Toast notification types
export type ToastType = 'success' | 'error' | 'info';

// Toast notification interface
export interface Toast {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

// Default toast state
const defaultToast: Toast = {
  show: false,
  type: 'info',
  title: '',
  message: '',
  duration: 3000,
};

// Reactive toast state
export const toast = ref<Toast>({ ...defaultToast });

// Toast notification functions
export const showToast = (options: Omit<Toast, 'show'>) => {
  toast.value = { ...options, show: true };
  
  // Auto-hide the toast after duration
  if (options.duration !== 0) {
    setTimeout(() => {
      hideToast();
    }, options.duration || defaultToast.duration);
  }
};

export const showSuccessToast = (title: string, message: string, duration?: number) => {
  showToast({ type: 'success', title, message, duration });
};

export const showErrorToast = (title: string, message: string, duration?: number) => {
  showToast({ type: 'error', title, message, duration });
};

export const showInfoToast = (title: string, message: string, duration?: number) => {
  showToast({ type: 'info', title, message, duration });
};

export const hideToast = () => {
  toast.value.show = false;
};

// Reset toast to default state
export const resetToast = () => {
  toast.value = { ...defaultToast };
};