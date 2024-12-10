import type { Writable } from "svelte/store";

export type TextFunctionsType = {
	setEnd: () => void;
	setBegin: () => void;
};

export type BlockListType = {
	_id: string;
	type: string;
	data: unknown;
	dom_node?: Node;
	text_functions?: TextFunctionsType;
}[];

export type blockListStore = Writable<BlockListType>;
