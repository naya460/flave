import { RdbData } from "../../rdb_data/rdb_data";
import type { RdbResourcesType } from "../rdb_resources";

export type JoinData = {
	id: string;
	on: {
		value1: string;
		value2: string;
	};
};

export class RdbJoinClause {
	private rdb_data: RdbData;

	private hooks: (() => void)[] = [];

	private join_data: JoinData;

	private rdb_resources: RdbResourcesType = {
		properties: [],
		constraints: [],
		page_list: [],
	};

	constructor(join_data: JoinData) {
		this.join_data = join_data;
		this.rdb_data = new RdbData(join_data.id);
		this.rdb_data.subscribe((v) => {
			this.rdb_resources = v.rdb_resources;
			this.callHooks();
		});
	}

	getJoinData() {
		return this.join_data;
	}

	getJoinedResources(resources: RdbResourcesType) {
		const tmp: RdbResourcesType = {
			properties: [...resources.properties, ...this.rdb_resources.properties],
			constraints: [
				...resources.constraints,
				...this.rdb_resources.constraints,
			],
			page_list: [],
		};

		for (const page of resources.page_list) {
			const target_page_list = this.rdb_resources.page_list.filter((v) =>
				v.properties?.some((v) => v.id === this.join_data.on.value2)
			);
			for (const target_page of target_page_list) {
				const v1 = page.properties?.find(
					(v) => v.id === this.join_data.on.value1
				);
				const v2 = target_page.properties?.find(
					(v) => v.id === this.join_data.on.value2
				);
				if (v1 !== undefined && v2 !== undefined && v1?.value === v2?.value) {
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
				}
			}
		}

		return tmp;
	}

	public subscribe(hook: () => void) {
		this.hooks.push(hook);
		hook();

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		for (const hook of this.hooks) {
			hook();
		}
	}
}
