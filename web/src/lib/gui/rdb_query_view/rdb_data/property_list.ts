import type { PropertyHeader } from "$lib/gui/rdb_view/types";

type HookType = (v: PropertyHeader[]) => void;

export class PropertyList {
	private properties: PropertyHeader[] = [];

	private hooks: HookType[] = [];

	constructor(rdb_id: string | null) {
		this.init(rdb_id);
	}

	public changeRdb(rdb_id: string | null) {
		this.init(rdb_id);
	}

	private init(rdb_id: string | null) {
		if (rdb_id === null) {
			this.properties = [];
		} else {
			this.properties = [
				{
					id: rdb_id,
					type: "page",
					name: "page",
				} as PropertyHeader,
			];
		}

		this.callHooks();
	}

	public setProperties(properties: PropertyHeader[]) {
		for (const property of properties) {
			this.addProperty(property);
		}
		this.callHooks();
	}

	public addProperty(property: PropertyHeader) {
		if (this.properties.some((v) => v.id === property.id) === false) {
			this.properties.push(property);
		}
		this.callHooks();
	}

	public subscribe(hook: HookType) {
		this.hooks.push(hook);
		hook(this.properties);

		return () => {
			const index = this.hooks.findIndex((v) => v === hook);
			this.hooks.splice(index, 1);
		};
	}

	private callHooks() {
		for (const hook of this.hooks) {
			hook(this.properties);
		}
	}
}
