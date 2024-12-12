import { flvFetch } from "$lib/flv_fetch";

type RdbListType = {
	_id: string;
	title: string;
}[];

type HookType = (v: RdbListType) => void;

export class RdbList {
	workspace_id: string;

	hooks: HookType[] = [];

	rdb_list: RdbListType = [];

	constructor(workspace_id: string) {
		this.workspace_id = workspace_id;
		this.fetch();
	}

	async fetch() {
		const res = await flvFetch(`workspaces/${this.workspace_id}/rdbs`);
		this.rdb_list = await res.json();
		this.callHooks();
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook(this.rdb_list);

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	callHooks() {
		for (const hook of this.hooks) {
			hook(this.rdb_list);
		}
	}
}
