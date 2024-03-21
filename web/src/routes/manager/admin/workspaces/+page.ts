import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
	const res = await fetch(`http://${url.hostname}:8080/workspaces`, {
		credentials: "include",
	});
	const json = await res.json();

	const items: { id: string; name: string; owner: string }[] = [];
	for (const workspace of json) {
		items.push({
			id: workspace._id,
			name: workspace.name,
			owner: workspace.owner,
		});
	}

	return { items };
};
