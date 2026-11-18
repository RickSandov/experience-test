import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readJsonResponse } from '../api/http';
import useConfiguredEthosFetch from './useConfiguredEthosFetch';

/**
 * TanStack Mutation wrapper around useConfiguredEthosFetch for POST/PUT/PATCH/DELETE calls.
 * Call mutate({ url, method, body }); pass invalidateKeys to refetch related queries on success.
 * @param {object} [config]
 * @param {Array<Array>} [config.invalidateKeys] - queryKeys to invalidate after a successful mutation
 * @param {object} [config] - remaining useMutation options (onError, onSettled, etc.)
 */
export default function useEthosMutation({ invalidateKeys, onSuccess, ...options } = {}) {
    const authenticatedEthosFetch = useConfiguredEthosFetch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ url, method = 'POST', body, ...fetchOptions }) => {
            const response = await authenticatedEthosFetch(url, {
                ...fetchOptions,
                method,
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...fetchOptions.headers },
                body: body !== undefined ? JSON.stringify(body) : undefined
            });

            // Writes may answer 200/201 with an empty body (→ null); errors carry the contract's { message }.
            return readJsonResponse(response);
        },
        onSuccess: (data, variables, context) => {
            invalidateKeys?.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
            onSuccess?.(data, variables, context);
        },
        ...options
    });
}
