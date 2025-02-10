import type {RequestEvent} from "@sveltejs/kit";
import type {ApiResponse} from "$lib/api/types";
import {env} from "$env/dynamic/private";
import {keysToCamelCase, keysToSnakeCase} from "$lib/api/util";

export abstract class Resource {
    protected constructor(
        protected readonly event: RequestEvent,
        protected readonly basePath: string = ""
    ) {
    }

    /**
     * Makes a type-safe HTTP request to the API endpoint.
     *
     * This method handles:
     * - URL construction
     * - Authentication headers
     * - Request options
     * - JSON body serialization with snake_case conversion
     * - Response parsing with camelCase conversion
     * - Error handling
     *
     * @template T - The expected type of the successful response payload
     *
     * @param {string} method - The HTTP method to use (GET, POST, PUT, DELETE, etc.)
     * @param {string} [path=''] - The path to append to the base resource path
     * @param {object} [body] - The request body object (automatically converted to snake_case)
     * @param {RequestInit} [options={}] - Additional fetch options to merge with defaults
     *
     * @returns {Promise<ApiResponse<T>>} A promise that resolves to either:
     *   - On success: `{ type: 'success', payload: T }`
     *   - On error: `{ type: 'error', error: { status: number, payload: any } }`
     *
     * @throws {never} This method never throws - all errors are returned in the ApiResponse
     *
     * @example
     * // GET request
     * const response = await request<Product>('GET', '/123');
     * if (response.type === 'success') {
     *   const product = response.payload; // type: Product
     * }
     *
     * @example
     * // POST request with body
     * const response = await request<Product>('POST', '', {
     *   name: 'New Product',
     *   price: 99.99
     * });
     *
     * @example
     * // Custom options
     * const response = await request<Product>('GET', '/123', undefined, {
     *   cache: 'no-cache',
     *   headers: {
     *     'X-Custom-Header': 'value'
     *   }
     * });
     */
    protected async request<T>(
        method: string,
        path: string = '',
        body?: object,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const baseUrl = env.BACKEND_URL;
        const requestUrl = `${baseUrl}${this.basePath}${path}`;

        const baseHeaders: HeadersInit = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.event.locals.accessToken) {
            baseHeaders['Authorization'] = `Bearer ${this.event.locals.accessToken}`;
        }

        const requestOptions: RequestInit = {
            method,
            headers: {...baseHeaders, ...options.headers},
            ...options
        };

        if (body) {
            requestOptions.body = JSON.stringify(keysToSnakeCase(body));
        }

        try {
            const response = await fetch(requestUrl, requestOptions);
            const json = keysToCamelCase(await response.json());

            if (!response.ok) {
                return {
                    type: 'error',
                    error: {
                        status: response.status,
                        payload: json
                    }
                };
            }

            return {
                type: 'success',
                payload: json
            };
        } catch (e) {
            return {
                type: 'error',
                error: {
                    status: 0,
                    payload: e
                }
            };
        }
    }

}