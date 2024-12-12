import { flvFetch } from "$lib/flv_fetch";
import type { BlockListType } from "$lib/types/block_list";

//
// Keydown Events
//

export function onKeyDown(
	event: KeyboardEvent,
	block_list: BlockListType,
	font: {
		family: string;
		size: number;
	}
): boolean {
	let changed = false;

	const tmp = getSelection(block_list);
	if (tmp === null) return false;
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

	if (event.key === "Backspace") {
		event.preventDefault();
		const tmp = onBackspaceKeyDown(block_list, selection, index);
		if (tmp) changed = tmp;
	}

	if (event.key === "Enter") {
		event.preventDefault();
		onEnterKeyDown(block_list, selection, index);
	}

	return changed;
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

function onBackspaceKeyDown(
	block_list: BlockListType,
	selection: Selection,
	index: number
): boolean {
	let changed = false;

	if (selection.isCollapsed) {
		// delete line
		if (selection.focusOffset == 0 && index !== 0) {
			// get current text
			const node_value = block_list[index].dom_node?.firstChild?.nodeValue;
			if (node_value !== undefined && node_value !== null) {
				// generate concat text
				const ok = block_list[index - 1].text_functions?.concatEnd(node_value);

				if (ok) {
					block_list[index].text_functions?.deleteBlock();
				}
			}
		}
		// delete text
		else {
			// generate deleted text
			const node_value = block_list[index].dom_node?.firstChild?.nodeValue;
			const text = node_value
				?.slice(0, selection.focusOffset - 1)
				.concat(node_value?.slice(selection.focusOffset));

			if (
				block_list[index].dom_node?.firstChild?.nodeValue !== undefined &&
				block_list[index].dom_node?.firstChild?.nodeValue !== null &&
				text !== undefined
			) {
				const offset = selection.focusOffset;

				// apply deleted text to dom
				block_list[index].dom_node.firstChild.nodeValue = text;

				// move selection
				selection.setPosition(
					block_list[index].dom_node.firstChild,
					offset - 1
				);

				changed = true;
			}
		}
	}

	return changed;
}

function onEnterKeyDown(
	block_list: BlockListType,
	selection: Selection,
	index: number
) {
	if (selection.isCollapsed) {
		const node_value = block_list[index]?.dom_node?.firstChild?.nodeValue;
		const text1 = node_value?.slice(0, selection.focusOffset);
		const text2 = node_value?.slice(selection.focusOffset);

		if (text1 !== undefined && text2 !== undefined) {
			block_list[index].text_functions?.insertBlock("paragraph", {
				text: text2,
			});
			block_list[index].text_functions?.setText(text1);
		}
	}
}

//
// text functions
//

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

export function concatEnd(
	own: HTMLDivElement,
	id: string,
	text: string
): boolean {
	const selection = window.getSelection();
	if (selection === null) return false;

	const node_value = own.firstChild?.nodeValue;

	if (
		node_value !== undefined &&
		node_value !== null &&
		own.firstChild !== null
	) {
		const bind_text = node_value.concat(text);
		const offset = node_value.length;

		// apply deleted text to dom
		own.firstChild.nodeValue = bind_text;

		// move selection
		selection.setPosition(own.firstChild, offset);

		// send change block to server
		flvFetch(`blocks/${id}`, "PATCH", {
			data: { text: bind_text },
		});

		return true;
	}
	return false;
}

export function deleteBlock(
	block_list: BlockListType,
	id: string
): BlockListType {
	// send delete block to server
	flvFetch(`blocks/${id}`, "DELETE");

	// delete block in block list
	const list_index = block_list.findIndex((v) => v._id === id);
	block_list.splice(list_index, 1);

	return block_list;
}

export function insertBlock(
	page_id: string,
	block_id: string,
	type: string,
	data: unknown,
	hook: (id: string) => void
) {
	const res = flvFetch("blocks", "POST", {
		page_id,
		next_of: block_id,
		type,
		data,
	});

	res.then((v) => {
		v.text().then((w) => {
			if (typeof w !== "string") return;
			hook(w);
		});
	});
}

export function setText(own: HTMLDivElement, block_id: string, text: string) {
	if (
		own.firstChild?.nodeValue !== undefined &&
		own.firstChild.nodeValue !== null
	) {
		own.firstChild.nodeValue = text;
		flvFetch(`blocks/${block_id}`, "PATCH", {
			data: { text },
		});
	}
}
