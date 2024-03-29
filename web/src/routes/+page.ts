import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
	const res = await fetch(`http://${url.hostname}:8080/sessions/is_valid`, {
		credentials: "include",
	});
	const json = await res.json();
	const ok: boolean = json.ok;

	if (ok === false) {
		redirect(302, "/signin");
	}

	const user_res = await fetch(
		`http://${url.hostname}:8080/users/${json.user_id}`,
		{ credentials: "include" }
	);
	const user_json = await user_res.json();

	const workspaces = await fetch(
		`http://${url.hostname}:8080/users/${json.user_id}/workspaces`,
		{ credentials: "include" }
	);
	const workspaces_json: { name: string }[] = await workspaces.json();

	return {
		user_id: json.user_id,
		name: user_json.name,
		workspaces: workspaces_json,
	};
};
