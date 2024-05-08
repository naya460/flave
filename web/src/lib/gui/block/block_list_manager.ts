import type { blockListStore } from "$lib/types/block_list";
import { get } from "svelte/store";

let block_list: blockListStore;

export function setBlockList(list: blockListStore) {
	block_list = list;
}

export function moveCaretUp(current_block_id: string) {
	const selection = window.getSelection();
	if (selection === null) return;

	const pos = get(block_list).findIndex((v) => v._id === current_block_id);
	if (pos < 1) return;

	if (selection.isCollapsed) {
		const node = get(block_list)[pos - 1].dom_node?.childNodes[0];
		if (node === undefined || node.nodeValue === null) return;
		const offset =
			selection.anchorOffset > node.nodeValue.length
				? node.nodeValue.length
				: selection.anchorOffset;
		selection.setPosition(node, offset);
	}
}

export function moveCaretDown(current_block_id: string) {
	const selection = window.getSelection();
	if (selection === null) return;

	const pos = get(block_list).findIndex((v) => v._id === current_block_id);
	if (pos < 0 || pos > get(block_list).length - 1) return;

	if (selection.isCollapsed) {
		const node = get(block_list)[pos + 1].dom_node?.childNodes[0];
		if (node === undefined || node.nodeValue === null) return;
		const offset =
			selection.anchorOffset > node.nodeValue.length
				? node.nodeValue.length
				: selection.anchorOffset;
		selection.setPosition(node, offset);
	}
}
