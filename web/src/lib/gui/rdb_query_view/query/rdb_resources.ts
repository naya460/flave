import type { PropertyHeader } from "$lib/gui/rdb_view/types";
import type { ConstraintType } from "../rdb_data/rdb_data";
import type { PageType } from "../rdb_page_list";

export type RdbResourcesType = {
	properties: PropertyHeader[];
	constraints: ConstraintType[];
	page_list: PageType[];
};
