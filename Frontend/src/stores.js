import {writable} from "svelte/store"

export const userID = writable(localStorage.getItem("userID") || "");
userID.subscribe((val) => localStorage.setItem())