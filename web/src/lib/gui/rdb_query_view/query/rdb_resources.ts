import type { PageList } from "$lib/gui/rdb_view/page_list_filter";
import type { PropertyHeader } from "$lib/gui/rdb_view/types";
import type { ConstraintType } from "../rdb_data/rdb_data";

export type RdbResourcesType = {
	properties: PropertyHeader[];
	constraints: ConstraintType[];
	page_list: PageList;
};
