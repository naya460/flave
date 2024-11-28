type PropertyType = "text" | "page" | "checkbox" | "relation" | "validated";

interface PropertyBase {
	id: string;
	type: PropertyType;
	option?: unknown;
	value: unknown;
}

export type PropertyHeader = Property & {
	name: string;
	value: never;
};

export type Property =
	| (PropertyBase & {
			id: string;
			type: "text";
			option?: never;
			value: string;
	  })
	| {
			id: string;
			type: "page";
			option?: never;
			value: {
				title: string;
			};
	  }
	| {
			id: string;
			type: "checkbox";
			option?: never;
			value: boolean;
	  }
	| {
			id: string;
			type: "relation";
			option: {
				rdb: string;
				only: boolean;
			};
			value: {
				page_list: string[];
			};
	  }
	| {
			id: string;
			type: "validated";
			option?: never;
			value: {
				result: boolean | null;
			};
	  };

export function toProperty(
	property: PropertyHeader,
	target: unknown
): Property | null {
	if (property.type === "text") {
		let value = "";
		if (typeof target === "string") {
			value = target;
		}
		return { id: property.id, type: "text", value: value } as {
			id: string;
			type: "text";
			value: string;
		};
	}
	if (property.type === "page") {
		const value = { title: "" };
		if (typeof target === "object" && target !== null) {
			if ("title" in target && typeof target.title === "string") {
				value.title = target.title;
			}
		}
		return { id: property.id, type: "page", value: value } as {
			id: string;
			type: "page";
			value: { title: string };
		};
	}
	if (property.type === "checkbox") {
		let value = false;
		if (typeof target === "boolean") {
			value = target;
		}
		return { id: property.id, type: "checkbox", value: value } as {
			id: string;
			type: "checkbox";
			value: boolean;
		};
	}
	if (property.type === "relation") {
		const value = { page_list: [] } as { page_list: string[] };
		if (typeof target === "object" && target !== null) {
			if ("page_list" in target && Array.isArray(target.page_list)) {
				value.page_list = target.page_list;
			}
		}
		return {
			id: property.id,
			type: "relation",
			option: property.option,
			value: value,
		} as {
			id: string;
			type: "relation";
			option: {
				rdb: string;
				only: boolean;
			};
			value: { page_list: string[] };
		};
	}
	if (property.type === "validated")
		return { id: property.id, type: "validated", value: target } as {
			id: string;
			type: "validated";
			value: {
				result: boolean | null;
			};
		};
	return null;
}
