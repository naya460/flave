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
				value = property?.value;
			}
			if (value !== filter.value) {
				ok = false;
				break;
			}
		}

		if (ok === true) {
			filtered_page_list = [...filtered_page_list, page];
		}
	}

	return filtered_page_list;
}
