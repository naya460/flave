import { RdbFromClause } from "./from/from";
import type { RdbResourcesType } from "./rdb_resources";
import { RdbSelectClause } from "./select";

type HookType = (v: RdbResourcesType) => void;

export class RdbQuery {
	private rdb_from: RdbFromClause;
	private rdb_select = new RdbSelectClause({
		properties: [],
		constraints: [],
		page_list: [],
	});

	private hooks: HookType[] = [];

	private rdb_resources: RdbResourcesType = {
		properties: [],
		constraints: [],
		page_list: [],
	};

	constructor(rdb_id: string | null = null) {
		this.rdb_from = new RdbFromClause(rdb_id);

		this.rdb_from.subscribe((v) => {
			this.rdb_select.updateRdbResources(v.resources);
		});
		this.rdb_select.subscribe((v) => {
			this.rdb_resources = v.rdb_resources;
			this.callHooks();
		});
	}

	public getRdbData() {
		return this.rdb_from.getRdbData();
	}

	public getRdbQueryClause() {
		return this.rdb_from;
	}

	public getRdbSelectClause() {
		return this.rdb_select;
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook(this.rdb_resources);

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		for (const hook of this.hooks) {
			hook(this.rdb_resources);
		}
	}
}
