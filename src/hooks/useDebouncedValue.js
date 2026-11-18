import { useEffect, useState } from 'react';

/**
 * The value, updated only after it has stopped changing for `delay` ms.
 * @template T
 * @param {T} value
 * @param {number} [delay=500]
 * @returns {T}
 */
export default function useDebouncedValue(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
