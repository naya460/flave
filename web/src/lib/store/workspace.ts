import { writable } from "svelte/store";

export const workspace_id_store = writable<string>("");

export const workspace_name_store = writable<string>("");
