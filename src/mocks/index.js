import { FIXTURES } from './fixtures.js';
import { createMockStore } from './mockStore.js';

/** One in-memory store per page load, shared by every mocked query and mutation. */
export const mockStore = createMockStore(FIXTURES);

/** Simulated pipeline latency (ms). */
export const MOCK_DELAY = 300;

/** Run a mock-store call after the simulated latency; a thrown error rejects. */
export const withMockDelay = (call) => new Promise((resolve, reject) => {
    window.setTimeout(() => {
        try {
            resolve(call());
        } catch (error) {
            reject(error);
        }
    }, MOCK_DELAY);
});
