import { writable } from "svelte/store";

export const page_path_store = writable<string[]>([]);

export const page_title_store = writable("");

export const selecting_block_store = writable<string | undefined>("");

export const page_block_moving_store = writable<string | undefined>(undefined);
