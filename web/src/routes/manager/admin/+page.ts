import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
	const res = await fetch(`http://${url.hostname}:8080/users`);
	const json = await res.json();

	const items: { id: string; name: string; auth_id: string }[] = [];
	for (const user of json) {
		items.push({ id: user._id, name: user.name, auth_id: user.auth_id });
	}

	return { json, items };
};
