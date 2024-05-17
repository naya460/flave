import type { Writable } from "svelte/store";

type block_list = {
	_id: string;
	type: "paragraph" | "rdb_view";
	data: unknown;
	dom_node?: Node;
}[];

export type blockListStore = Writable<block_list>;