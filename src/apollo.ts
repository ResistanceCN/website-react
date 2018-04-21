import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

const authLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        token: localStorage.authToken
    }
}));

export const client = new ApolloClient({
    link: authLink.concat(new HttpLink({
        uri: process.env.REACT_APP_API_ENDPOINT
    })),
    cache: new InMemoryCache()
});

export const adminClient = new ApolloClient({
    link: authLink.concat(new HttpLink({
        uri: process.env.REACT_APP_ADMIN_API_ENDPOINT
    })),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only'
        }
    }
});
