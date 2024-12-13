import type { PropertyHeader } from "../rdb_view/types";
import type { RdbData } from "./rdb_data";

type HookType = (v: {
	properties: PropertyHeader[];
	display: string[];
}) => void;

export class RdbFilteredProperties {
	rdb_data: RdbData;
	display: string[] = [];

	hooks: HookType[] = [];

	rdb_id: string | null = null;
	properties: PropertyHeader[] = [];

	constructor(rdb_data: RdbData) {
		this.rdb_data = rdb_data;

		rdb_data.subscribe((v) => {
			this.properties = v.properties;

			if (this.rdb_id !== v.rdb_id) {
				this.display = [];
				this.rdb_id = v.rdb_id;
				this.addAll();
			}

			this.callHooks();
		});
	}

	get_filtered_properties(): PropertyHeader[] {
		const filtered_properties: PropertyHeader[] = [];

		for (const display_id of this.display) {
			const property = this.properties.find((v) => v.id === display_id);
			if (property !== undefined) {
				filtered_properties.push(property);
			}
		}

		return filtered_properties;
	}

	public add(id: string) {
		if (this.display.includes(id) === false) {
			this.display.push(id);
		}
		this.callHooks();
	}

	public remove(id: string) {
		const index = this.display.findIndex((v) => v === id);
		if (index !== -1) {
			this.display.splice(index, 1);
		}
		this.callHooks();
	}

	public addAll() {
		for (const property of this.properties) {
			if (this.display.includes(property.id) === false) {
				this.display.push(property.id);
			}
		}
		this.callHooks();
	}

	public removeAll() {
		this.display = [];
		this.callHooks();
	}

	public moveUp(id: string) {
		const index = this.display.findIndex((v) => v === id);
		if (index !== -1) {
			this.display.splice(index, 1);
			this.display.splice(index - 1, 0, id);
			this.callHooks();
		}
	}

	public moveDown(id: string) {
		const index = this.display.findIndex((v) => v === id);
		if (index !== -1) {
			this.display.splice(index, 1);
			this.display.splice(index + 1, 0, id);
			this.callHooks();
		}
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook({
			properties: this.get_filtered_properties(),
			display: this.display,
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	callHooks() {
		const filtered_properties = this.get_filtered_properties();
		for (const hook of this.hooks) {
			hook({
				properties: filtered_properties,
				display: this.display,
			});
		}
	}
}
