
// TODO: make env var
export const CACHE_TTL = 120000; // 2 min in milliseconds
export const BASE_URL = 'https://uxqjo9vhoa.execute-api.ap-southeast-1.amazonaws.com';

export interface BaseResponse<T> {
    data?: T;
    ok: boolean;
    ts: number;

    // error
    msg?: string;
    error?: string;
}
