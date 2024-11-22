import { flvFetch } from "$lib/flv_fetch";

const page_list = new Map<
	string,
	{
		title: string;
		hooks: ((title: string) => void)[];
	}
>();

export function subscribePage(page_id: string, hook: (title: string) => void) {
	const tmp = page_list.get(page_id);
	if (tmp === undefined) {
		page_list.set(page_id, { title: "", hooks: [hook] });
		fetchPage(page_id);
	} else {
		page_list.set(page_id, { title: tmp.title, hooks: [...tmp.hooks, hook] });
		hook(tmp.title);
	}
}

export function setPage(page_id: string, title: string) {
	const tmp = page_list.get(page_id);
	if (tmp === undefined) {
		page_list.set(page_id, { title, hooks: [] });
	} else {
		page_list.set(page_id, { title, hooks: tmp.hooks });
		tmp.hooks.forEach((hook) => hook(title));
	}
}

async function fetchPage(page_id: string) {
	const data = await (await flvFetch(`pages/${page_id}`)).json();
	setPage(page_id, data.title);
}
