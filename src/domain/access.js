/**
 * Role list from card configuration: an array, or a comma-separated string as
 * Experience Setup text fields deliver it. Entries are trimmed; blanks dropped.
 * @param {unknown} value
 * @returns {string[]}
 */
export function parseRoleList(value) {
    let entries = [];
    if (Array.isArray(value)) entries = value;
    else if (typeof value === 'string') entries = value.split(',');
    return entries.map((entry) => String(entry ?? '').trim()).filter(Boolean);
}

/**
 * What the current user may do. An empty or missing role list grants nothing, so a
 * misconfigured card never opens writes to everyone. A write role implies read.
 * @param {string[]|undefined} userRoles - roles from useUserInfo()
 * @param {{ writeAccessRoles?: unknown, readAccessRoles?: unknown }|undefined} config - card configuration
 * @returns {{ canRead: boolean, canWrite: boolean }}
 */
export function resolveAccess(userRoles, config) {
    const roles = Array.isArray(userRoles) ? userRoles : [];
    const hasAny = (allowed) => allowed.some((role) => roles.includes(role));

    const canWrite = hasAny(parseRoleList(config?.writeAccessRoles));
    const canRead = canWrite || hasAny(parseRoleList(config?.readAccessRoles));
    return { canRead, canWrite };
}
