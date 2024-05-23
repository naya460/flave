import { workspace_id_store, workspace_name_store } from "$lib/store/workspace";
import type { LayoutLoad } from "./$types";
export const ssr = false;

export const load: LayoutLoad = async ({ params, fetch, url }) => {
	const res = await fetch(
		`http://${url.hostname}:8080/workspaces/${params.workspace_id}`,
		{ credentials: "include" }
	);
	const json: { name: string } = await res.json();

	workspace_id_store.set(params.workspace_id);
	workspace_name_store.set(json.name);

	return {
		workspace_id: params.workspace_id,
		page_id: params.page_id,
		name: json.name,
	};
};
