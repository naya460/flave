import type { FiltablePropertyList } from "../rdb_data/filtable_property_list";
import { RdbData, type ConstraintType } from "../rdb_data/rdb_data";

type HookSendType = {
	rdb_id: string | null;
	title: string;
	constraints: ConstraintType[];
	properties: FiltablePropertyList;
};

type HookType = (v: HookSendType) => void;

export class RdbFromClause {
	private rdb_data: RdbData;

	private hooks: HookType[] = [];

	private hook_send_value: HookSendType | null = null;

	constructor(rdb_id: string | null) {
		this.rdb_data = new RdbData(rdb_id);

		this.rdb_data.subscribe((v) => {
			this.hook_send_value = {
				...v,
				properties: this.rdb_data.getPropertyList(),
			};

			this.callHooks();
		});

		this.callHooks();
	}

	public changeRdb(rdb_id: string | null) {
		this.rdb_data.changeRdb(rdb_id);
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		if (this.hook_send_value !== null) {
			hook(this.hook_send_value);
		}
		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		if (this.hook_send_value !== null) {
			for (const hook of this.hooks) {
				hook(this.hook_send_value);
			}
		}
	}
}
