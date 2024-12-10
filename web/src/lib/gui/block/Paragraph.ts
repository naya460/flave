import type { BlockListType } from "$lib/types/block_list";

export function onKeyDown(event: KeyboardEvent, block_list: BlockListType) {
	const tmp = getSelection(block_list);
	if (tmp === null) return;
	const [selection, index] = tmp;

	if (event.key === "ArrowLeft") {
		event.preventDefault();
		onLeftKeyDown(block_list, selection, index);
	}

	if (event.key === "ArrowRight") {
		event.preventDefault();
		onRightKeyDown(block_list, selection, index);
	}
}

function getSelection(block_list: BlockListType): [Selection, number] | null {
	const selection = window.getSelection();
	if (selection === null) return null;
	const focus_node = selection.focusNode;
	if (focus_node === null) return null;

	const index = block_list.findIndex(
		(v) => v.dom_node?.childNodes[0] === focus_node
	);
	if (index < 0) return null;

	return [selection, index];
}

function onLeftKeyDown(
	block_list: BlockListType,
	selection: Selection,
	index: number
) {
	if (selection.focusOffset === 0) {
		block_list[index - 1]?.text_functions?.setEnd();
	} else {
		selection.setPosition(selection.focusNode, selection.focusOffset - 1);
	}
}

function onRightKeyDown(
	block_list: BlockListType,
	selection: Selection,
	index: number
) {
	if (
		selection.focusOffset ===
		block_list[index]?.dom_node?.firstChild?.nodeValue?.length
	) {
		block_list[index + 1]?.text_functions?.setBegin();
	} else {
		selection.setPosition(selection.focusNode, selection.focusOffset + 1);
	}
}

export function setEnd(own: HTMLDivElement) {
	const selection = window.getSelection();
	if (selection === null) return null;

	selection.setPosition(own.firstChild, own.firstChild?.nodeValue?.length);
}

export function setBegin(own: HTMLDivElement) {
	const selection = window.getSelection();
	if (selection === null) return null;

	selection.setPosition(own.firstChild, 0);
}
