import { page_path_store } from "$lib/store/page_path";
import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ fetch, url, params }) => {
	const res = await fetch(
		`http://${url.hostname}:8080/pages/${params.page_id}`,
		{ credentials: "include" }
	);
	const page_data: { title: string } = await res.json();

	const path_res = await fetch(
		`http://${url.hostname}:8080/pages/${params.page_id}/path`,
		{ credentials: "include" }
	);
	const path = await path_res.json();

	page_path_store.set(path);

	const blocks_res = await fetch(
		`http://${url.hostname}:8080/pages/${params.page_id}/blocks`,
		{ credentials: "include" }
	);
	const blocks: {
		_id: string;
		type: "paragraph";
		data: unknown;
	}[] = await blocks_res.json();
	console.log(blocks);

	return {
		workspace_id: params.workspace_id,
		page_id: params.page_id,
		page_data,
		blocks,
	};
};
