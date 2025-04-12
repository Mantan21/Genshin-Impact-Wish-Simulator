import { writable } from "svelte/store";
import { primogem } from "./app-stores";
import { storageLocal } from "$lib/helpers/dataAPI/api-localstore";
import axios from 'axios';

export const user = writable(null); // Stores the logged-in user session
export const isAuthenticated = writable(false); // Tracks session status

export async function checkSession() {
  try {
    const res = await axios.get("/api/session", { 
      withCredentials: true 
    });
    
    const data = res.data;
    user.set(data);
    isAuthenticated.set(true);

    const group = data.group;
    const isAdded = storageLocal.get("added");
    
    console.log('added?', isAdded);
    if (Object.keys(isAdded).length === 0 && (group === "whale" || group === "dolphin")) {
      primogem.update((v) => v + 5120);
      storageLocal.set('added', 1);
    }
    
  } catch (error) {
    console.error("Session check failed:", error);
    isAuthenticated.set(false);
  }
}
