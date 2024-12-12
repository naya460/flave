import { flvFetch } from "$lib/flv_fetch";
import type { PropertyHeader } from "../rdb_view/types";

type ConstraintType = {
	id: string;
	type: string;
	option: object;
};

type HookType = (v: {
	rdb_id: string | null;
	title: string;
	properties: PropertyHeader[];
	constraints: ConstraintType[];
}) => void;

export class RdbData {
	rdb_id: string | null = null;

	hooks: HookType[] = [];

	title: string = "";
	properties: PropertyHeader[] = [];
	constraints: ConstraintType[] = [];

	constructor(rdb_id: string | null) {
		this.init(rdb_id);
	}

	public changeRdb(rdb_id: string | null) {
		this.init(rdb_id);
	}

	init(rdb_id: string | null) {
		this.rdb_id = rdb_id;

		this.title = "";
		this.properties = [];
		this.constraints = [];

		this.fetch();
	}

	async fetch() {
		if (this.rdb_id === null) return;

		const res = await flvFetch(`rdbs/${this.rdb_id}`);
		const rdb_data = await res.json();

		this.title = rdb_data.title;
		this.properties =
			rdb_data.properties === undefined ? [] : rdb_data.properties;
		this.constraints =
			rdb_data.constraints === undefined ? [] : rdb_data.constraints;

		this.callHooks();
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook({
			rdb_id: this.rdb_id,
			title: this.title,
			properties: this.properties,
			constraints: this.constraints,
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	callHooks() {
		for (const hook of this.hooks) {
			hook({
				rdb_id: this.rdb_id,
				title: this.title,
				properties: this.properties,
				constraints: this.constraints,
			});
		}
	}
}
