import type { blockListStore } from "$lib/types/block_list";
import { get } from "svelte/store";

let block_list: blockListStore;

export function setBlockList(list: blockListStore) {
	block_list = list;
}

function getTextBlockList() {
	return get(block_list).filter(w => {
		return w.type === "paragraph" || w.type === "heading";
	});
}

export function moveCaretUp(current_block_id: string) {
	const selection = window.getSelection();
	if (selection === null) return;

	const pos = getTextBlockList().findIndex((v) => v._id === current_block_id);
	if (pos < 1) return;

	if (selection.isCollapsed) {
		const node = getTextBlockList()[pos - 1].dom_node?.childNodes[0];
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

	const pos = getTextBlockList().findIndex((v) => v._id === current_block_id);
	if (pos < 0 || pos > getTextBlockList().length - 2) return;

	if (selection.isCollapsed) {
		const node = getTextBlockList()[pos + 1].dom_node?.childNodes[0];
		if (node === undefined || node.nodeValue === null) return;
		const offset =
			selection.anchorOffset > node.nodeValue.length
				? node.nodeValue.length
				: selection.anchorOffset;
		selection.setPosition(node, offset);
	}
}
