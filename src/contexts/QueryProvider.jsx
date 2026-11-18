import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// each entry bundle (card/page) gets its own client instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
});

const QueryProvider = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

export default QueryProvider;
