import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
	const res = await fetch(`http://${url.hostname}:8080/sessions`, {
		credentials: "include",
	});
	const json = await res.json();

	const items: { id: string; user_id: string }[] = [];
	for (const user of json) {
		items.push({
			id: user._id,
			user_id: user.user_id,
		});
	}

	return { json, items };
};
