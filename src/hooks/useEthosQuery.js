import { useQuery } from '@tanstack/react-query';
import useConfiguredEthosFetch from './useConfiguredEthosFetch';

/**
 * TanStack Query wrapper around useConfiguredEthosFetch for cacheable GET requests.
 * @param {Array} queryKey - TanStack Query key, e.g. ['ethos', 'persons', personId]
 * @param {string} url - resource path/URL passed to useConfiguredEthosFetch
 * @param {object} [options] - additional useQuery options (enabled, select, etc.)
 */
export default function useEthosQuery(queryKey, url, options = {}) {
    const authenticatedEthosFetch = useConfiguredEthosFetch();

    return useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            // Data Connect pipelines answer JSON; Ellucian's examples always send Accept.
            const response = await authenticatedEthosFetch(url, { signal, headers: { Accept: 'application/json' } });

            if (!response || response.status !== 200) {
                throw new Error(`Error fetching ${url}`);
            }

            return response.json();
        },
        ...options,
        enabled: Boolean(url) && (options.enabled ?? true)
    });
}
