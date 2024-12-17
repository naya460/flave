import { RdbData } from "../rdb_data/rdb_data";
import { type RdbResourcesType } from "./rdb_resources";

type HookType = (v: RdbResourcesType) => void;

export class RdbFromClause {
	private rdb_data: RdbData;

	private hooks: HookType[] = [];

	private rdb_resources: RdbResourcesType = {
		properties: [],
		constraints: [],
		page_list: [],
	};

	constructor(rdb_id: string | null) {
		this.rdb_data = new RdbData(rdb_id);

		this.rdb_data.subscribe((v) => {
			this.rdb_resources.properties = v.rdb_resources.properties;
			this.rdb_resources.constraints = v.rdb_resources.constraints;
			this.rdb_resources.page_list = v.rdb_resources.page_list;
			this.callHooks();
		});

		this.callHooks();
	}

	public changeRdb(rdb_id: string | null) {
		this.rdb_data.changeRdb(rdb_id);
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
