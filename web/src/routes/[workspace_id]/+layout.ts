import { workspace_id_store, workspace_name_store } from "$lib/store/workspace";
import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
export const ssr = false;

export const load: LayoutLoad = async ({ params, fetch, url }) => {
	const res = await fetch(
		`http://${url.hostname}:8080/workspaces/${params.workspace_id}`,
		{ credentials: "include" }
	);

	if (res.ok === false) {
		const res = await fetch(`http://${url.hostname}:8080/sessions/is_valid`, {
			credentials: "include",
		});
		const json = await res.json();
		const ok: boolean = json.ok;

		if (ok === false) {
			const redirect_url = new URL("/signin", url);
			redirect_url.searchParams.append(
				"next",
				`${params.workspace_id}/${params.page_id}`
			);
			redirect(302, redirect_url);
		}
	}

	const json: { name: string } = await res.json();

	workspace_id_store.set(params.workspace_id);
	workspace_name_store.set(json.name);

	return {
		workspace_id: params.workspace_id,
		page_id: params.page_id,
		name: json.name,
		workspaces: await getWorkspaceList(fetch, url),
	};
};

async function getWorkspaceList(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	url: URL
) {
	const res = await fetch(`http://${url.hostname}:8080/sessions/is_valid`, {
		credentials: "include",
	});
	const json = await res.json();

	const workspaces = await fetch(
		`http://${url.hostname}:8080/users/${json.user_id}/workspaces`,
		{ credentials: "include" }
	);
	const workspaces_json: { _id: string; name: string }[] =
		await workspaces.json();

	return workspaces_json;
}
