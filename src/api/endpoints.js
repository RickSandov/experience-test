/**
 * Data Connect pipelines (docs/api/xmommst.openapi.yaml). Names go bare to
 * authenticatedEthosFetch: a leading "/" produces "//name" and a 404 preflight.
 */
export const PIPELINES = Object.freeze({
    username: 'shu-admin-get-username',
    zmommst: 'shu-admin-get-zmommst',
    zmomrel: 'shu-get-zmomrel',
    zmomacc: 'shu-get-zmomacc',
    create: 'shu-admin-post-zmommst',
    update: 'shu-admin-put-zmommst',
    remove: 'shu-delete-zmommst'
});

/**
 * Serve mock data instead of calling the pipeline. Flip one flag to false as each
 * pipeline goes live; `write` covers create, update and delete.
 */
export const MOCK = Object.freeze({
    username: true,
    zmommst: true,
    zmomrel: true,
    zmomacc: true,
    write: true
});

const byBannerId = (pipeline, bannerId) => `${pipeline}?bannerId=${encodeURIComponent(bannerId)}`;

export const usernameUrl = (bannerId) => byBannerId(PIPELINES.username, bannerId);
export const zmommstUrl = (bannerId) => byBannerId(PIPELINES.zmommst, bannerId);

/**
 * Message shown for a failed call: the contract's `{ message }`, else the status.
 * @param {number} status
 * @param {unknown} body - parsed response body, if any
 */
export function requestErrorMessage(status, body) {
    const message = body && typeof body === 'object' && typeof body.message === 'string' ? body.message.trim() : '';
    return message || `Request failed (${status})`;
}
