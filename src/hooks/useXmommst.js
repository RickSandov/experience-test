import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK, PIPELINES, usernameUrl, zmommstUrl } from '../api/endpoints';
import { readJsonResponse } from '../api/http';
import { isRecord, removeRecord, upsertRecord } from '../domain/records';
import { mockStore, withMockDelay } from '../mocks';
import useConfiguredEthosFetch from './useConfiguredEthosFetch';
import useMockableEthosQuery from './useMockableEthosQuery';

export const recordsKey = (bannerId) => ['zmommst', bannerId];

/**
 * shu-admin-get-username for a Banner ID. Resolves `{}` or null for an unknown ID.
 * @param {string} bannerId
 * @param {boolean} enabled - only a valid Banner ID with read access
 */
export function usePerson(bannerId, enabled) {
    return useMockableEthosQuery(['username', bannerId], usernameUrl(bannerId), {
        mock: MOCK.username,
        mockData: () => mockStore.username(bannerId),
        enabled
    });
}

/**
 * shu-admin-get-zmommst for a Banner ID.
 * @param {string} bannerId
 * @param {boolean} enabled
 */
export function useRecords(bannerId, enabled) {
    return useMockableEthosQuery(recordsKey(bannerId), zmommstUrl(bannerId), {
        mock: MOCK.zmommst,
        mockData: () => mockStore.list(bannerId),
        enabled
    });
}

/**
 * Relationship and access code lists; they rarely change, so they are cached for the
 * page's life.
 * @param {boolean} enabled
 * @returns {{ rel: object[]|undefined, acc: object[]|undefined, isError: boolean }}
 */
export function useCodes(enabled) {
    const rel = useMockableEthosQuery(['codes', 'rel'], PIPELINES.zmomrel, {
        mock: MOCK.zmomrel,
        mockData: () => mockStore.relationships(),
        staleTime: Infinity,
        enabled
    });
    const acc = useMockableEthosQuery(['codes', 'acc'], PIPELINES.zmomacc, {
        mock: MOCK.zmomacc,
        mockData: () => mockStore.access(),
        staleTime: Infinity,
        enabled
    });
    return { rel: rel.data, acc: acc.data, isError: rel.isError || acc.isError };
}

const MOCK_WRITES = {
    POST: (body) => mockStore.create(body),
    PUT: (body) => mockStore.update(body),
    DELETE: (body) => mockStore.remove(body)
};

/**
 * Create, update or delete an XMOMMST record, then update that Banner ID's cached
 * list from the response (no refetch unless the response is empty).
 * `mutateAsync({ method: 'POST'|'PUT'|'DELETE', body })`; errors carry the
 * contract's `{ message }`.
 * @param {string} bannerId
 */
export function useRecordWrite(bannerId) {
    const authenticatedEthosFetch = useConfiguredEthosFetch();
    const queryClient = useQueryClient();
    const pipelines = { POST: PIPELINES.create, PUT: PIPELINES.update, DELETE: PIPELINES.remove };

    return useMutation({
        mutationFn: async ({ method, body }) => {
            if (MOCK.write) return withMockDelay(() => MOCK_WRITES[method](body));

            const response = await authenticatedEthosFetch(pipelines[method], {
                method,
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(body)
            });
            return readJsonResponse(response);
        },
        // Put the pipeline's answer straight into the cached list (live and mock keys
        // share the prefix). A write that answers with an empty body falls back to a refetch.
        onSuccess: (data, { method, body }) => {
            const queryKey = recordsKey(bannerId);
            if (method === 'DELETE') {
                queryClient.setQueriesData({ queryKey }, (list) => removeRecord(list, body.id));
            } else if (isRecord(data)) {
                queryClient.setQueriesData({ queryKey }, (list) => upsertRecord(list, data));
            } else {
                queryClient.invalidateQueries({ queryKey });
            }
        }
    });
}
