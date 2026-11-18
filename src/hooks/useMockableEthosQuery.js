import { useQuery } from '@tanstack/react-query';
import useEthosQuery from './useEthosQuery';

/**
 * useEthosQuery wrapper that can return mock fixture data instead of hitting the real endpoint.
 * Both the live and mock queries are called unconditionally on every render (rules of hooks);
 * only the returned result is conditional on `mock`.
 * @param {Array} queryKey - TanStack Query key; mock data lives under [...queryKey, 'mock'],
 *   so update caches by prefix (setQueriesData / invalidateQueries)
 * @param {string} url - resource path/URL passed to useEthosQuery
 * @param {object} [options]
 * @param {boolean} [options.mock=false] - return mock data instead of calling the live endpoint
 * @param {*|(() => *)} [options.mockData] - value resolved by the mock query when `mock` is true;
 *   a function is called at query time (so it can page/filter with the current params), and
 *   an error it throws rejects the query like a failed request
 * @param {number} [options.mockDelay=300] - simulated latency (ms) for the mock query
 */
export default function useMockableEthosQuery(queryKey, url, { mock = false, mockData, mockDelay = 300, ...options } = {}) {
    const liveQuery = useEthosQuery(queryKey, mock ? undefined : url, options);

    // Its own key: two observers on one key share the query's options, and React's
    // re-renders leave the mock queryFn last, so an invalidation would refetch mock data.
    const mockQuery = useQuery({
        queryKey: [...queryKey, 'mock'],
        queryFn: () => new Promise((resolve, reject) => window.setTimeout(() => {
            try {
                resolve(typeof mockData === 'function' ? mockData() : mockData);
            } catch (error) {
                reject(error);
            }
        }, mockDelay)),
        ...options,
        enabled: mock && (options.enabled ?? true)
    });

    return mock ? mockQuery : liveQuery;
}
