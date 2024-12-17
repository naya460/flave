import { flvFetch } from "$lib/flv_fetch";
import type { PageList } from "$lib/gui/rdb_view/page_list_filter";
import type { PropertyHeader } from "$lib/gui/rdb_view/types";
import type { RdbResourcesType } from "../query/rdb_resources";
import { RdbPageList } from "../rdb_page_list";
import { PropertyList } from "./property_list";

export type ConstraintType = {
	id: string;
	type: string;
	option: object;
};

type HookType = (v: {
	rdb_id: string | null;
	title: string;
	rdb_resources: RdbResourcesType;
}) => void;

export class RdbData {
	private rdb_id: string | null = null;

	private property_list = new PropertyList(null);
	private page_list = new RdbPageList(null);

	private hooks: HookType[] = [];

	private title: string = "";
	private properties: PropertyHeader[] = [];
	private constraints: ConstraintType[] = [];
	private pages: PageList = [];

	constructor(rdb_id: string | null) {
		this.property_list.subscribe((v) => {
			this.properties = v;
			this.callHooks();
		});

		this.page_list.subscribe((v) => {
			this.pages = v.page_list;
			this.callHooks();
		});

		this.init(rdb_id);
	}

	public changeRdb(rdb_id: string | null) {
		if (this.rdb_id !== rdb_id) {
			this.init(rdb_id);
		}
	}

	init(rdb_id: string | null) {
		this.rdb_id = rdb_id;

		this.property_list.changeRdb(rdb_id);
		this.page_list.changeRdb(rdb_id);

		this.title = "";
		this.properties = [];
		this.constraints = [];
		this.pages = [];

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
			rdb_resources: {
				properties: this.properties,
				constraints: this.constraints,
				page_list: this.pages,
			},
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	public getPropertyList() {
		return this.property_list;
	}

	public getPageList() {
		return this.page_list;
	}

	callHooks() {
		for (const hook of this.hooks) {
			hook({
				rdb_id: this.rdb_id,
				title: this.title,
				rdb_resources: {
					properties: this.properties,
					constraints: this.constraints,
					page_list: this.pages,
				},
			});
		}
	}
}
