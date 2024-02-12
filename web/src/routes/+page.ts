import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, url }) => {
    const res = await fetch(`http://${url.hostname}:8080/test`);
    const text = await res.text();
    return { text };
}
