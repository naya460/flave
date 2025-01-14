import { flvFetch } from "$lib/flv_fetch";

type OriginalPageType = {
	_id: string;
	title: string;
	properties?: {
		id: string;
		value: unknown;
	}[];
	constraints?: {
		id: string;
		result: boolean;
	}[];
};

export type PageType = {
	_id: string | null;
	properties: {
		id: string;
		value: unknown;
	}[];
	constraints: {
		id: string;
		result: boolean;
	}[];
};

type HookType = (v: { rdb_id: string | null; page_list: PageType[] }) => void;

export class RdbPageList {
	rdb_id: string | null = null;

	hooks: HookType[] = [];

	page_list: PageType[] = [];

	constructor(rdb_id: string | null) {
		this.init(rdb_id);
	}

	public changeRdb(rdb_id: string | null) {
		if (this.rdb_id !== rdb_id) {
			this.init(rdb_id);
		}
	}

	init(rdb_id: string | null) {
		this.rdb_id = rdb_id;

		this.page_list = [];

		this.callHooks();

		this.fetch();
	}

	async fetch() {
		if (this.rdb_id === null) return;

		const res = await flvFetch(`rdbs/${this.rdb_id}/pages`);
		if (res.ok === false) return;
		const original_page_list: OriginalPageType[] = await res.json();

		// add page property
		for (const page of original_page_list) {
			const new_page: PageType = {
				_id: page._id,
				properties: [
					{
						id: this.rdb_id,
						value: {
							_id: page._id,
							title: page.title,
						},
					},
				],
				constraints: [],
			};

			if (page.properties !== undefined) {
				new_page.properties = [...new_page.properties, ...page.properties];
			}
			if (page.constraints !== undefined) {
				new_page.constraints = [...page.constraints];
			}

			this.page_list.push(new_page);
		}

		this.callHooks();
	}

	public addPage(page: PageType) {
		this.page_list.push(page);
		this.callHooks();
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook({ rdb_id: this.rdb_id, page_list: this.page_list });

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	callHooks() {
		for (const hook of this.hooks) {
			hook({ rdb_id: this.rdb_id, page_list: this.page_list });
		}
	}
}
