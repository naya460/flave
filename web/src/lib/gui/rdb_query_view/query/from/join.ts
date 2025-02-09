import type { PropertyHeader } from "$lib/gui/rdb_view/types";
import { RdbData } from "../../rdb_data/rdb_data";
import type { PageType } from "../../rdb_page_list";
import type { RdbResourcesType } from "../rdb_resources";
import { checkEqual } from "./on";

export type JoinData = {
	id: string | null;
	type: "INNER" | "LEFT" | "RIGHT" | "FULL";
	on: {
		value1: string | null;
		value2: string | null;
	};
};

export type HookType = (v: {
	title: string;
	join_data: JoinData;
	abailable_properties: PropertyHeader[];
}) => void;

export class RdbJoinClause {
	private rdb_data: RdbData;

	private hooks: HookType[] = [];

	private join_data: JoinData;
	private usable_properties: {
		id: string;
		name: string;
	}[] = [];

	private title: string = "";
	private rdb_resources: RdbResourcesType = {
		properties: [],
		constraints: [],
		page_list: [],
	};

	constructor(join_data: JoinData) {
		this.join_data = join_data;
		this.rdb_data = new RdbData(join_data.id);
		this.rdb_data.subscribe((v) => {
			this.title = v.title;
			this.rdb_resources = v.rdb_resources;
			this.rdb_resources.properties = this.rdb_resources.properties.map((w) => {
				return { ...w, name: `${v.title} . ${w.name}` };
			});
			this.callHooks();
		});
	}

	public getUsableProperties() {
		return this.usable_properties;
	}

	public updateJoinData(join_data: JoinData) {
		this.join_data = join_data;
		this.rdb_data.changeRdb(join_data.id);
		this.callHooks();
	}

	public getJoinedResources(resources: RdbResourcesType): RdbResourcesType {
		this.usable_properties = [
			...resources.properties.map((v) => {
				return {
					id: v.id,
					name: v.name,
				};
			}),
			...this.rdb_resources.properties.map((v) => {
				return {
					id: v.id,
					name: v.name,
				};
			}),
		];

		const on = this.join_data.on;
		if (on.value1 === null || on.value2 === null) {
			return resources;
		}

		const tmp: RdbResourcesType = {
			properties: [...resources.properties, ...this.rdb_resources.properties],
			constraints: [
				...resources.constraints,
				...this.rdb_resources.constraints,
			],
			page_list: [],
		};

		const right_not_joined: PageType[] = [...this.rdb_resources.page_list];

		for (const page of resources.page_list) {
			let joined = false;

			for (const target_page of this.rdb_resources.page_list) {
				if (checkEqual(page, target_page, on.value1, on.value2)) {
					tmp.page_list.push({
						_id: null,
						properties: [
							...(page.properties === undefined ? [] : page.properties),
							...(target_page.properties === undefined
								? []
								: target_page.properties),
						],
						constraints: [
							...(page.constraints === undefined ? [] : page.constraints),
							...(target_page.constraints === undefined
								? []
								: target_page.constraints),
						],
					});

					joined = true;

					if (
						this.join_data.type === "RIGHT" ||
						this.join_data.type === "FULL"
					) {
						const index = right_not_joined.findIndex(
							(v) => v._id === target_page._id
						);
						if (index !== -1) {
							right_not_joined.splice(index, 1);
						}
					}
				}
			}

			if (joined === false) {
				if (this.join_data.type === "LEFT" || this.join_data.type === "FULL") {
					tmp.page_list.push(page);
				}
			}
		}

		if (this.join_data.type === "RIGHT" || this.join_data.type === "FULL") {
			tmp.page_list = [...tmp.page_list, ...right_not_joined];
		}

		return tmp;
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook({
			title: this.title,
			join_data: this.join_data,
			abailable_properties: this.rdb_resources.properties,
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		for (const hook of this.hooks) {
			hook({
				title: this.title,
				join_data: this.join_data,
				abailable_properties: this.rdb_resources.properties,
			});
		}
	}
}
