export type ApiResponse<T> = {
    type: 'success',
    payload: T
} | {
    type: 'error',
    error: ApiError
}

export type ApiError = {
    status: number;
    payload: any;
}