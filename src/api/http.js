import { requestErrorMessage } from './endpoints.js';

const parseOrUndefined = (text) => {
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
};

/**
 * Body of a pipeline response. 2xx with an empty body (allowed by the contract for
 * writes and for an unknown Banner ID) → null; ≥ 300 → Error with the contract's
 * `{ message }` or the status.
 * @param {Response|undefined} response - what authenticatedEthosFetch resolved
 * @returns {Promise<unknown>}
 */
export async function readJsonResponse(response) {
    if (!response) throw new Error('No response from the server');

    const text = await response.text();
    const body = text.trim() ? parseOrUndefined(text) : null;

    if (response.status < 200 || response.status >= 300) {
        throw new Error(requestErrorMessage(response.status, body));
    }
    if (body === undefined) throw new Error('Unexpected response from the server');
    return body;
}
