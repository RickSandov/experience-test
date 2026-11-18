const DEFAULT_LIMIT = 25;

const positive = (value) => (Number(value) > 0 ? Number(value) : null);

/**
 * Pagination props for EDS Pagination (0-based page) from a paged response
 * ({ total, offset, limit }). The response's offset/limit win over the requested ones,
 * because the backend caps limit at 50: a requested 100 that came back as 50 must page by
 * 50, or rows 50-99 would be skipped.
 * @param {{ total?: number, offset?: number, limit?: number }|undefined} response
 * @param {{ offset?: number, limit?: number }} requested
 * @returns {{ count: number, page: number, rowsPerPage: number, offsetOfPage: (page: number) => number }}
 */
export function pageView(response, requested) {
    const rowsPerPage = positive(response?.limit) ?? positive(requested?.limit) ?? DEFAULT_LIMIT;
    const offset = Number(response?.offset ?? requested?.offset) || 0;
    return {
        count: Number(response?.total) || 0,
        page: Math.floor(offset / rowsPerPage),
        rowsPerPage,
        offsetOfPage: (page) => page * rowsPerPage,
    };
}
