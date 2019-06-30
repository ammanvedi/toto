import React from 'react';
import {LibraryHome} from "./view/library-home/library-home";
import {ApolloProvider} from "react-apollo";
import { ApolloClient } from 'apollo-client';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './types/Introspection';
import { HttpLink } from 'apollo-link-http';
import {GRAPHQL_URL} from "./constant/url";

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});
const cache = new InMemoryCache( { fragmentMatcher } );
const link = new HttpLink({
    uri: GRAPHQL_URL
});

const client = new ApolloClient({
    cache,
    link
});

const App: React.FC = () => {
  return (
      <ApolloProvider client={client}>
          <LibraryHome/>
      </ApolloProvider>
  );
};

export default App;
