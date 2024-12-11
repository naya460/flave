import type { BlockListType } from "$lib/types/block_list";

export function onKeyDown(
	event: KeyboardEvent,
	block_list: BlockListType,
	font: {
		family: string;
		size: number;
	}
) {
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

	if (event.key === "ArrowDown") {
		event.preventDefault();
		onDownKeyDown(block_list, selection, index, font);
	}

	if (event.key === "ArrowUp") {
		event.preventDefault();
		onUpKeyDown(block_list, selection, index, font);
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

function onDownKeyDown(
	block_list: BlockListType,
	selection: Selection,
	index: number,
	font: {
		family: string;
		size: number;
	}
) {
	let text = block_list[index].dom_node?.firstChild?.nodeValue;
	if (text === null || text === undefined) return;
	text = text.slice(0, selection.focusOffset);

	const canvas = new OffscreenCanvas(0, 0);
	const context = canvas.getContext("2d");
	if (context === null) return;
	context.font = `${font.size * 10}px ${font.family}`;
	const size = context.measureText(text);

	block_list[index + 1]?.text_functions?.setCursor(size.width);
}

function onUpKeyDown(
	block_list: BlockListType,
	selection: Selection,
	index: number,
	font: {
		family: string;
		size: number;
	}
) {
	let text = block_list[index].dom_node?.firstChild?.nodeValue;
	if (text === null || text === undefined) return;
	text = text.slice(0, selection.focusOffset);

	const canvas = new OffscreenCanvas(0, 0);
	const context = canvas.getContext("2d");
	if (context === null) return;
	context.font = `${font.size * 10}px ${font.family}`;
	const size = context.measureText(text);

	block_list[index - 1]?.text_functions?.setCursor(size.width);
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

export function setCursor(
	own: HTMLDivElement,
	left: number,
	font: {
		family: string;
		size: number;
	}
) {
	const canvas = new OffscreenCanvas(0, 0);
	const context = canvas.getContext("2d");
	if (context === null) return;
	context.font = `${font.size * 10}px ${font.family}`;

	const text = own.firstChild?.nodeValue;
	if (text === undefined || text === null) return;
	const length = text.length;
	if (length === undefined) return;

	let begin = 0;
	let end = length;
	let counter = 0;

	while (begin !== end && begin !== end - 1) {
		const offset = Math.floor((begin + end) / 2);

		const width = context.measureText(text.slice(0, offset)).width;

		if (width >= left) {
			end = offset;
		} else {
			begin = offset;
		}

		counter = counter + 1;
		if (counter === 100) break;
	}

	const selection = window.getSelection();
	if (selection === null) return null;

	const begin_error = Math.abs(
		left - context.measureText(text.slice(0, begin)).width
	);
	const end_error = Math.abs(
		left - context.measureText(text.slice(0, end)).width
	);
	const offset = begin_error < end_error ? begin : end;

	selection.setPosition(own.firstChild, offset);
}
