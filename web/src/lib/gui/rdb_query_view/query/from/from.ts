import { RdbData } from "../../rdb_data/rdb_data";
import { type RdbResourcesType } from "../rdb_resources";
import { RdbJoinClause } from "./join";

type HookType = (v: {
	resources: RdbResourcesType;
	join_list: RdbJoinClause[];
}) => void;

export class RdbFromClause {
	private rdb_data: RdbData;

	private hooks: HookType[] = [];

	private from_title: string = "";
	private rdb_resources: RdbResourcesType = {
		properties: [],
		constraints: [],
		page_list: [],
	};

	private join_list: RdbJoinClause[] = [];

	constructor(rdb_id: string | null) {
		this.rdb_data = new RdbData(rdb_id);

		this.rdb_data.subscribe((v) => {
			this.from_title = v.title;
			if (this.join_list.length === 0) {
				this.rdb_resources.properties = v.rdb_resources.properties;
			} else {
				this.rdb_resources.properties = v.rdb_resources.properties.map((w) => {
					return { ...w, name: `${v.title} . ${w.name}` };
				});
			}

			this.rdb_resources.constraints = v.rdb_resources.constraints;
			this.rdb_resources.page_list = v.rdb_resources.page_list;
			this.callHooks();
		});

		this.callHooks();
	}

	public changeRdb(rdb_id: string | null) {
		this.join_list = [];
		this.callHooks();
		this.rdb_data.changeRdb(rdb_id);
	}

	public getRdbData() {
		return this.rdb_data;
	}

	public addJoin(
		id: string | null,
		type: "INNER" | "LEFT",
		on: { value1: string | null; value2: string | null }
	) {
		if (this.join_list.length === 0) {
			this.rdb_resources.properties = this.rdb_resources.properties.map((v) => {
				return { ...v, name: `${this.from_title} . ${v.name}` };
			});
		}

		const join_clause = new RdbJoinClause({ id, type, on });
		this.join_list.push(join_clause);
		join_clause.subscribe(() => {
			this.callHooks();
		});
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		const resources = this.calcJoinedResources();
		hook({
			join_list: this.join_list,
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
		for (const hook of this.hooks) {
			hook({
				join_list: this.join_list,
				resources,
			});
		}
	}
}
