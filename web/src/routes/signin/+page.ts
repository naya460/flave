import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, url }) => {
	const res = await fetch(`http://${url.hostname}:8080/sessions/is_valid`, {
		credentials: "include",
	});
	const json = await res.json();
	const ok: boolean = json.ok;

	if (ok) {
		redirect(302, "/");
	}
};
