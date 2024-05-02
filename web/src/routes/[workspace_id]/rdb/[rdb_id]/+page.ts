import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url, params }) => {
	const res = await fetch(`http://${url.hostname}:8080/rdbs/${params.rdb_id}`, {
		credentials: "include",
	});
	const rdb_data: {
		title: string;
		properties?: {
			id: string;
			type: string;
			name: string;
		}[];
	} = await res.json();

	return {
		workspace_id: params.workspace_id,
		rdb_id: params.rdb_id,
		rdb_data,
	};
};
