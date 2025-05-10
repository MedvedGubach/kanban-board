import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const uri = import.meta.env.VITE_GRAPHQL_URI || process.env.NEXT_PUBLIC_GRAPHQL_URI;

const httpLink = createHttpLink({ uri, });

const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

export default client;