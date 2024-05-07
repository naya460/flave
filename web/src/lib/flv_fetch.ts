export function flvFetch(
	route: string,
	method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
	body?: object
) {
	return fetch(`http://${location.hostname}:8080/${route}`, {
		method: method,
		mode: "cors",
		credentials: "include",
		headers:
			body === undefined ? undefined : { "Content-Type": "application/json" },
		body: body === undefined ? undefined : JSON.stringify(body),
	});
}
