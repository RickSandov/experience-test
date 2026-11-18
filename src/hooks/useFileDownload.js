import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import useEthosMutation from './useEthosMutation';

// The download pipeline returns { fileName, contentType, content } (see the
// OpenAPI contract); anything else is surfaced as an error.
function saveToBrowser(payload, fileName) {
    if (typeof payload?.content !== 'string') {
        throw new Error('Download response has no file content.');
    }
    const blob = new window.Blob([payload.content], { type: payload.contentType || 'text/plain' });
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = payload.fileName || fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
}

/**
 * Triggers a browser file download, either via a live GET request or mock data.
 * Both the live and mock mutations are called unconditionally on every render (rules of hooks);
 * only which mutation `download` invokes is conditional on `mock`.
 * @param {object} [config]
 * @param {string} [config.url] - resource path/URL to GET when `mock` is false
 * @param {boolean} [config.mock=false] - resolve `mockData` instead of calling the live endpoint
 * @param {*|(() => *)} [config.mockData] - payload resolved by the mock path; a function is
 *   called at download time
 * @param {number} [config.mockDelay=300] - simulated latency (ms) for the mock path
 */
export default function useFileDownload({ url, mock = false, mockData, mockDelay = 300 } = {}) {
    const fileNameRef = useRef();

    // saveToBrowser must run as a hook-level onSuccess (not a per-call mutate() onSuccess):
    // per-call onSuccess callbacks fire outside the mutation's error-handling try/catch, so a
    // thrown validation error there would be swallowed instead of populating `error` below.
    const liveMutation = useEthosMutation({
        onSuccess: (data) => saveToBrowser(data, fileNameRef.current)
    });

    const mockMutation = useMutation({
        mutationFn: () => new Promise((resolve, reject) => window.setTimeout(() => {
            try {
                resolve(typeof mockData === 'function' ? mockData() : mockData);
            } catch (error) {
                reject(error);
            }
        }, mockDelay)),
        onSuccess: (data) => saveToBrowser(data, fileNameRef.current)
    });

    const download = useCallback(
        (fileName) => {
            fileNameRef.current = fileName;
            if (mock) {
                mockMutation.mutate();
            } else {
                liveMutation.mutate({ url, method: 'GET', headers: { Accept: 'application/json' } });
            }
        },
        [mock, url, liveMutation, mockMutation]
    );

    const activeMutation = mock ? mockMutation : liveMutation;

    return {
        download,
        isDownloading: activeMutation.isPending,
        error: activeMutation.error
    };
}
