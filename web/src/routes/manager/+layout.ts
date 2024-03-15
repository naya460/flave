import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
export const ssr = false;

export const load: LayoutLoad = async ({ fetch, url, route }) => {
	const res = await fetch(`http://${url.hostname}:8080/sessions/is_valid`, {
		credentials: "include",
	});
	const json = await res.json();
	const ok: boolean = json.ok;

	if (ok === false) {
		const redirect_url = new URL("/signin", url);
		redirect_url.searchParams.append("next", route.id);
		redirect(302, redirect_url);
	}
};
