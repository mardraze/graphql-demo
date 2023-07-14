import config from './config';


import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const link = createHttpLink({
    uri: config.API_URL+'/graphql',
    credentials: 'include',
})

const api = new ApolloClient({
    link,
    cache: new InMemoryCache()
});



export default api;
