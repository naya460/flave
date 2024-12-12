import { flvFetch } from "$lib/flv_fetch";
import type { PageList } from "../rdb_view/page_list_filter";

type HookType = (v: { rdb_id: string | null; page_list: PageList }) => void;

export class RdbPageList {
	rdb_id: string | null = null;

	hooks: HookType[] = [];

	page_list: PageList = [];

	constructor(rdb_id: string | null) {
		this.init(rdb_id);
	}

	public changeRdb(rdb_id: string | null) {
		this.init(rdb_id);
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
		this.page_list = await res.json();

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
