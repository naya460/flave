import type { PropertyHeader } from "./types";

export type PageType = {
	_id: string;
	title: string;
	properties?: {
		id: string;
		value: unknown;
	}[];
	constraints?: {
		id: string;
		result: boolean;
	}[];
};

export type PageList = PageType[];

type Filters = {
	id: string;
	value: string | boolean;
}[];

export function toFilteredPageList(
	rdb_id: string,
	properties: PropertyHeader[],
	page_list: PageList,
	filters: Filters
) {
	let filtered_page_list: PageList = [];

	for (const page of page_list) {
		let ok = true;

		for (const filter of filters) {
			const property = page?.properties?.find((v) => v.id === filter.id);

			let value;
			if (property?.value === undefined) {
				switch (properties.find((v) => v.id === filter.id)?.type) {
					case "page": {
						value = page.title;
						break;
					}
					case "text": {
						value = "";
						break;
					}
					case "checkbox": {
						value = false;
						break;
					}
				}
			} else {
				value = property.value;
			}
			if (value !== filter.value) {
				ok = false;
				break;
			}
		}

		const page_property = properties.find((v) => v.type === "page");
		if (page_property !== undefined) {
			const v = {
				id: rdb_id,
				value: {
					title: page.title,
				},
			};
			if (page.properties === undefined) {
				page.properties = [v];
			} else {
				page.properties?.unshift(v);
			}
		}

		if (ok === true) {
			filtered_page_list = [...filtered_page_list, page];
		}
	}

	return filtered_page_list;
}
