import { writable } from "svelte/store";

export const user = writable(null); // Stores the logged-in user session
export const isAuthenticated = writable(false); // Tracks session status

export async function checkSession() {
  try {
    const res = await fetch("http://localhost:3001/api/session", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Session not found");

    const data = await res.json();
    user.set(data);
    isAuthenticated.set(true);
  } catch (error) {
    console.error("Session check failed:", error);
    isAuthenticated.set(false);
  }
}
