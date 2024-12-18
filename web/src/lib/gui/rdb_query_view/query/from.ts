import { RdbData } from "../rdb_data/rdb_data";
import { type RdbResourcesType } from "./rdb_resources";

type HookType = (v: {
	resources: RdbResourcesType;
	join_list: JoinData[];
}) => void;

type JoinData = {
	id: string;
	on: {
		value1: string;
		value2: string;
	};
};

export class RdbFromClause {
	private rdb_data: RdbData;

	private hooks: HookType[] = [];

	private rdb_resources: RdbResourcesType = {
		properties: [],
		constraints: [],
		page_list: [],
	};

	private join_list: RdbJoinClause[] = [];

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

	public getRdbData() {
		return this.rdb_data;
	}

	public addJoin(id: string, on: { value1: string; value2: string }) {
		const join_clause = new RdbJoinClause({ id, on });
		this.join_list.push(join_clause);
		join_clause.subscribe(() => {
			this.callHooks();
		});
	}

	private getJoinList() {
		const tmp = [];
		for (const join_data of this.join_list) {
			tmp.push(join_data.getJoinData());
		}
		return tmp;
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		const resources = this.calcJoinedResources();
		hook({
			join_list: this.getJoinList(),
			resources,
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private calcJoinedResources() {
		let resources = {
			properties: [...this.rdb_resources.properties],
			constraints: [...this.rdb_resources.constraints],
			page_list: [...this.rdb_resources.page_list],
		};
		for (const join of this.join_list) {
			resources = join.getJoinedResources(resources);
		}
		return resources;
	}

	private callHooks() {
		const resources = this.calcJoinedResources();
		const join_list = this.getJoinList();
		for (const hook of this.hooks) {
			hook({
				join_list,
				resources,
			});
		}
	}
}

class RdbJoinClause {
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
						_id: page._id + target_page._id,
						title: page.title + " " + target_page.title,
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
