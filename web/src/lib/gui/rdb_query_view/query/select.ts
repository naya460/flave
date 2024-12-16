import type { PropertyHeader } from "$lib/gui/rdb_view/types";
import type { RdbResourcesType } from "./rdb_resources";

type RdbSelectResources = {
	display: string[];
	display_properties: PropertyHeader[];
	hidden_properties: PropertyHeader[];
};

type HookType = (v: {
	rdb_resources: RdbResourcesType;
	rdb_select_resources: RdbSelectResources;
}) => void;

export class RdbSelectClause {
	private rdb_resources: RdbResourcesType;
	private display: string[];

	private hooks: HookType[] = [];

	constructor(rdb_resources: RdbResourcesType) {
		this.rdb_resources = rdb_resources;
		this.display = rdb_resources.properties.map((v) => v.id);

		this.callHooks();
	}

	public updateRdbResources(rdb_resources: RdbResourcesType) {
		for (const display of this.display) {
			if (rdb_resources.properties.some((v) => v.id === display) === false) {
				const index = this.display.findIndex((v) => v === display);
				this.display.splice(index, 1);
			}
		}

		this.rdb_resources = { ...rdb_resources };

		this.callHooks();
	}

	public displayProperty(id: string) {
		if (this.display.includes(id) === false) {
			this.display.push(id);
			this.callHooks();
		}
	}

	public displayAllProperties() {
		for (const property of this.rdb_resources.properties) {
			if (this.display.includes(property.id) === false) {
				this.display.push(property.id);
			}
		}
		this.callHooks();
	}

	public hideProperty(id: string) {
		const index = this.display.findIndex((v) => v === id);
		if (index !== -1) {
			this.display.splice(index, 1);
			this.callHooks();
		}
	}

	public hideAllProperties() {
		this.display = [];
		this.callHooks();
	}

	private getProperties() {
		const display_properties: PropertyHeader[] = [];
		const hidden_properties: PropertyHeader[] = [
			...this.rdb_resources.properties,
		];

		for (const display_id of this.display) {
			const index = hidden_properties.findIndex((v) => v.id === display_id);
			if (index !== -1) {
				display_properties.push(hidden_properties[index]);
				hidden_properties.splice(index, 1);
			}
		}

		return { display_properties, hidden_properties };
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);

		const tmp = this.getProperties();
		const hook_value = {
			rdb_resources: {
				...this.rdb_resources,
				properties: tmp.display_properties,
			},
			rdb_select_resources: {
				display: this.display,
				...tmp,
			},
		};
		hook(hook_value);

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		const tmp = this.getProperties();
		const hook_value = {
			rdb_resources: {
				...this.rdb_resources,
				properties: tmp.display_properties,
			},
			rdb_select_resources: {
				display: this.display,
				...tmp,
			},
		};

		for (const hook of this.hooks) {
			hook(hook_value);
		}
	}
}
