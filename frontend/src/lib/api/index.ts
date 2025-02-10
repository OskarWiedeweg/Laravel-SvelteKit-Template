import type {RequestEvent} from "@sveltejs/kit";

export function api(event: RequestEvent): ApiClient {
    return new ApiClient(event);
}

class ApiClient {
    constructor(private event: RequestEvent) {
    }

}
