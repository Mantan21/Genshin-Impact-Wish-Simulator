import { writable } from 'svelte/store';

// Initialize auth store
export const authStore = writable({
  isAuthenticated: false,
  user: null
});

// Function to check authentication status
export async function checkAuth() {
  try {
    const response = await fetch("http://localhost:3001/", {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      authStore.set({ isAuthenticated: true, user: data.user });
    } else {
      authStore.set({ isAuthenticated: false, user: null });
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    authStore.set({ isAuthenticated: false, user: null });
  }
}
