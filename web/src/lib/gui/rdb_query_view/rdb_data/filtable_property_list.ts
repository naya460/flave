// import type { PropertyHeader } from "../rdb_view/types";
// import type { RdbData } from "./rdb_data";

import type { PropertyHeader } from "$lib/gui/rdb_view/types";
import { PropertyList } from "./property_list";

// type HookType = (v: {
// 	properties: PropertyHeader[];
// 	display: string[];
// }) => void;

// export class RdbFilteredProperties {
// 	rdb_data: RdbData;
// 	display: string[] = [];

// 	hooks: HookType[] = [];

// 	rdb_id: string | null = null;
// 	properties: PropertyHeader[] = [];

// 	constructor(rdb_data: RdbData) {
// 		this.rdb_data = rdb_data;

// 		rdb_data.subscribe((v) => {
// 			this.properties = v.properties;

// 			if (this.rdb_id !== v.rdb_id) {
// 				this.display = [];
// 				this.rdb_id = v.rdb_id;
// 				this.addAll();
// 			}

// 			this.callHooks();
// 		});
// 	}

// 	get_filtered_properties(): PropertyHeader[] {
// 		const filtered_properties: PropertyHeader[] = [];

// 		for (const display_id of this.display) {
// 			const property = this.properties.find((v) => v.id === display_id);
// 			if (property !== undefined) {
// 				filtered_properties.push(property);
// 			}
// 		}

// 		return filtered_properties;
// 	}

// 	public add(id: string) {
// 		if (this.display.includes(id) === false) {
// 			this.display.push(id);
// 		}
// 		this.callHooks();
// 	}

// 	public remove(id: string) {
// 		const index = this.display.findIndex((v) => v === id);
// 		if (index !== -1) {
// 			this.display.splice(index, 1);
// 		}
// 		this.callHooks();
// 	}

// 	public addAll() {
// 		for (const property of this.properties) {
// 			if (this.display.includes(property.id) === false) {
// 				this.display.push(property.id);
// 			}
// 		}
// 		this.callHooks();
// 	}

// 	public removeAll() {
// 		this.display = [];
// 		this.callHooks();
// 	}

// 	public moveUp(id: string) {
// 		const index = this.display.findIndex((v) => v === id);
// 		if (index !== -1) {
// 			this.display.splice(index, 1);
// 			this.display.splice(index - 1, 0, id);
// 			this.callHooks();
// 		}
// 	}

// 	public moveDown(id: string) {
// 		const index = this.display.findIndex((v) => v === id);
// 		if (index !== -1) {
// 			this.display.splice(index, 1);
// 			this.display.splice(index + 1, 0, id);
// 			this.callHooks();
// 		}
// 	}

// 	public subscribe(hook: HookType) {
// 		this.hooks.push(hook);
// 		hook({
// 			properties: this.get_filtered_properties(),
// 			display: this.display,
// 		});

// 		return () => {
// 			const index = this.hooks.findIndex((v) => v === hook);
// 			this.hooks.splice(index, 1);
// 		};
// 	}

// 	callHooks() {
// 		const filtered_properties = this.get_filtered_properties();
// 		for (const hook of this.hooks) {
// 			hook({
// 				properties: filtered_properties,
// 				display: this.display,
// 			});
// 		}
// 	}
// }

type HookType = (v: {
	properties: PropertyHeader[];
	display: string[];
	filtered_properties: PropertyHeader[];
	hidden_properties: PropertyHeader[];
}) => void;

export class FiltablePropertyList {
	private property_list = new PropertyList(null);
	private display: string[] = [];

	private hooks: HookType[] = [];

	private properties: PropertyHeader[] = [];

	//
	// initialize functions
	//

	constructor(rdb_id: string | null) {
		this.property_list.changeRdb(rdb_id);

		this.property_list.subscribe((v) => {
			this.properties = v;
			this.callHooks();
		});

		this.init();
	}

	public changeRdb(rdb_id: string | null) {
		this.property_list.changeRdb(rdb_id);
		this.init();
	}

	private init() {
		this.display = [];
		this.callHooks();
	}

	//
	// property functions
	//
	public setProperties(properties: PropertyHeader[]) {
		this.property_list.setProperties(properties);
	}

	public addProperty(property: PropertyHeader) {
		this.property_list.addProperty(property);
	}

	//
	// display functions
	//
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

	//
	// hooks functions
	//

	private getFilteredProperties() {
		const filtered_properties: PropertyHeader[] = [];
		const hidden_properties: PropertyHeader[] = [...this.properties];

		for (const display_id of this.display) {
			const index = hidden_properties.findIndex((v) => v.id === display_id);
			if (index !== -1) {
				filtered_properties.push(hidden_properties[index]);
				hidden_properties.splice(index, 1);
			}
		}

		return { filtered_properties, hidden_properties };
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);

		hook({
			properties: this.properties,
			display: this.display,
			...this.getFilteredProperties(),
		});

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		const filtered_properties = this.getFilteredProperties();
		for (const hook of this.hooks) {
			hook({
				properties: this.properties,
				display: this.display,
				...filtered_properties,
			});
		}
	}
}
