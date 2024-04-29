import type { Writable } from "svelte/store";

type block_list = {
	_id: string;
	type: "paragraph";
	data: unknown;
}[];

export type blockListStore = Writable<block_list>;
