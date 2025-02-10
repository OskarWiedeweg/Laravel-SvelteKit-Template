import {type ActionFailure, error as kitError} from "@sveltejs/kit";
import {setError, type SuperValidated} from "sveltekit-superforms";
import type {ApiError} from "$lib/api/types";

export type ErrorCodes = 'unknown' | 'validation' | 'authorization';
export type HandleableError = {
    message: string,
    code: ErrorCodes | string,
    description?: string,
    status?: number,
    field?: string,
}

export function handleError(error: ApiError, handler?: (error: ApiError) => HandleableError | null | undefined): HandleableError {
    if (handler) {
        const handled = handler(error);
        if (handled) {
            return handled;
        }
    }

    if (error.status === 422) {
        const errors = error.payload.errors;
        for (let field in errors) {
            const messages = errors[field];
            return {
                message: messages[0],
                status: 400,
                code: 'validation',
                field: field
            }
        }
    } else if (error.status === 403) {
        return {
            message: "Unauthorized action",
            description: "You are not allowed to access or modify this ressource!",
            status: 403,
            code: "authorization",
        }
    }
    console.log(error)

    return {
        status: 500,
        message: "An unknown error occurred.",
        code: 'unknown',
    }
}

export function handleLoadError(error: ApiError, handler?: (error: ApiError) => (HandleableError | null | undefined)): never {
    const handleableError = handleError(error, handler);

    return kitError(handleableError.status ?? 500, handleableError);
}

export function handleFormError(form: SuperValidated<any>, error: ApiError, defaultField?: string, handler?: (error: ApiError) => (HandleableError | null | undefined)): ActionFailure<any> {
    const handleableError = handleError(error, handler);
    if (!handleableError.field) {
        if (defaultField) {
            handleableError.field = defaultField;
        } else {
            return setError(form, handleableError.message);
        }
    }
    return setError(form, handleableError.field, handleableError.message);
}