import type { PageLoad } from "./$types";
export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	return {
		workspace_id: params.workspace_id,
		page_id: params.page_id,
	};
};
