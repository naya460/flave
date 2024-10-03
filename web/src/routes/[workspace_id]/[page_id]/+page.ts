import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url, params }) => {
	const res = await fetch(
		`http://${url.hostname}:8080/pages/${params.page_id}`,
		{ credentials: "include" }
	);
	const page_data: {
		title: string;
		rdb?: string;
		properties?: {
			id: string;
			value: string;
		}[];
	} = await res.json();

	const path_res = await fetch(
		`http://${url.hostname}:8080/pages/${params.page_id}/path`,
		{ credentials: "include" }
	);
	const path = await path_res.json();

	return {
		page_path: path,
		workspace_id: params.workspace_id,
		page_id: params.page_id,
		page_data,
	};
};
