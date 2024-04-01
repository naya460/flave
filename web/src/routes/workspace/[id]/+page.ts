import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, url }) => {
	const res = await fetch(
		`http://${url.hostname}:8080/workspaces/${params.id}`,
		{ credentials: "include" }
	);
	const json: { name: string } = await res.json();

	return {
		workspace_id: params.id,
		name: json.name,
	};
};
