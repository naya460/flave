import { flvFetch } from "$lib/flv_fetch";
import { FiltablePropertyList } from "./filtable_property_list";

type ConstraintType = {
	id: string;
	type: string;
	option: object;
};

type HookType = (v: {
	rdb_id: string | null;
	title: string;
	constraints: ConstraintType[];
}) => void;

export class RdbData {
	rdb_id: string | null = null;

	hooks: HookType[] = [];

	title: string = "";
	property_list = new FiltablePropertyList(null);
	constraints: ConstraintType[] = [];

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

		this.title = "";
		this.property_list.changeRdb(rdb_id);
		this.constraints = [];

		this.fetch();
	}

	async fetch() {
		if (this.rdb_id === null) return;

		const res = await flvFetch(`rdbs/${this.rdb_id}`);
		const rdb_data = await res.json();

		this.title = rdb_data.title;

		if (rdb_data.properties !== undefined) {
			this.property_list.setProperties(rdb_data.properties);
		}

		this.constraints =
			rdb_data.constraints === undefined ? [] : rdb_data.constraints;

		this.callHooks();
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook({
			rdb_id: this.rdb_id,
			title: this.title,
			constraints: this.constraints,
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	public getPropertyList() {
		return this.property_list;
	}

	callHooks() {
		for (const hook of this.hooks) {
			hook({
				rdb_id: this.rdb_id,
				title: this.title,
				constraints: this.constraints,
			});
		}
	}
}
