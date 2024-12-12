import type { Writable } from "svelte/store";

export type TextFunctionsType = {
	setEnd: () => void;
	setBegin: () => void;
	setCursor: (left: number) => void;
	concatEnd: (text: string) => boolean;
	deleteBlock: () => void;
	insertBlock: (type: string, data: unknown) => void;
	setText: (text: string) => void;
};

export type BlockListType = {
	_id: string;
	type: string;
	data: unknown;
	dom_node?: Node;
	text_functions?: TextFunctionsType;
}[];

export type blockListStore = Writable<BlockListType>;
