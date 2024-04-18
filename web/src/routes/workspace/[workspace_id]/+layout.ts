import type { LayoutLoad } from "./$types";
export const ssr = false;

export const load: LayoutLoad = async ({ params, fetch, url }) => {
	const res = await fetch(
		`http://${url.hostname}:8080/workspaces/${params.workspace_id}`,
		{ credentials: "include" }
	);
	const json: { name: string } = await res.json();

	return {
		workspace_id: params.workspace_id,
		page_id: params.page_id,
		name: json.name,
	};
};
