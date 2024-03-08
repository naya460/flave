import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
	console.log(`http://${url.hostname}:8080/flave`);
	const res = await fetch(`http://${url.hostname}:8080/flave`);
	const json = await res.json();

	const items: { id: string; name: string }[] = [];
	for (const user of json) {
		items.push({ id: user._id, name: user.name });
	}

	return { json, items };
};
