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

const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_ENDPOINT + '/graphql'
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;
