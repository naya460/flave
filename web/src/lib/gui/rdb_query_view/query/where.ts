import type { RdbResourcesType } from "./rdb_resources";

export type WhereCondition = {
	id: string;
	value: unknown;
};

export type HookType = (v: {
	resources: RdbResourcesType;
	conditions: WhereCondition[];
}) => void;

export class RdbWhereClause {
	private rdb_resources: RdbResourcesType;
	private conditions: WhereCondition[] = [];

	private hooks: HookType[] = [];

	constructor(rdb_resources: RdbResourcesType, conditions: WhereCondition[]) {
		this.rdb_resources = rdb_resources;
		this.conditions = conditions;
	}

	public updateRdbResources(rdb_resources: RdbResourcesType) {
		this.rdb_resources = { ...rdb_resources };
		this.callHooks();
	}

	public addCondition(condition: WhereCondition) {
		this.conditions.push(condition);
		this.callHooks();
	}

	public editCondition(index: number, concidion: WhereCondition) {
		this.conditions.splice(index, 1, concidion);
		this.callHooks();
	}

	private getFilteredResources(): RdbResourcesType {
		const page_list = [];

		for (const page of this.rdb_resources.page_list) {
			let ok = true;

			for (const condition of this.conditions) {
				const property = page.properties.find((v) => v.id === condition.id);
				if (property !== undefined) {
					if (property.value !== condition.value) {
						ok = false;
						break;
					}
				} else {
					if (condition.value != false) {
						ok = false;
						break;
					}
				}
			}

			if (ok === true) {
				page_list.push(page);
			}
		}

		return {
			...this.rdb_resources,
			page_list,
		};
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);

		hook({
			resources: this.getFilteredResources(),
			conditions: this.conditions,
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		for (const hook of this.hooks) {
			hook({
				resources: this.getFilteredResources(),
				conditions: this.conditions,
			});
		}
	}
}
