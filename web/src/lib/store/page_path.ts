import { writable } from "svelte/store";

export const page_path_store = writable<string[]>([]);
