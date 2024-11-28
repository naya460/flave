import type { PropertyHeader } from "./types";

export function toFilteredProperties(
	properties: PropertyHeader[],
	display: string[]
) {
	let filtered_properties: PropertyHeader[] = [];

	for (const display_id of display) {
		const property = properties.find((v) => v.id === display_id);
		if (property !== undefined) {
			filtered_properties.push(property);
		}
	}

	if (display.includes("page")) {
		filtered_properties = [
			{
				id: "",
				name: "page",
				type: "page",
			} as PropertyHeader,
			...filtered_properties,
		];
	}

	return filtered_properties;
}
