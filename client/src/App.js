import React, { Component } from 'react';
import {
  ApolloClient,
  gql,
  graphql,
  ApolloProvider,
  // createNetworkInterface, // for live server
} from 'react-apollo';
// for mocked server
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';

// import { typeDefs } from '../../src/schema';
import typeDefs from './schema';

import PostList from './PostList';
import './App.css';

// Tut from here https://dev-blog.apollodata.com/full-stack-react-graphql-tutorial-582ac8d24e3b?_ga=2.249254087.1991559453.1497035474-344072256.1490729773

// for mocked server
const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });
const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

const client = new ApolloClient({
  networkInterface: mockNetworkInterface,
});

// for live server
// const networkInterface = createNetworkInterface({
//  uri: 'http://localhost:3000/graphql',
// });
// const client = new ApolloClient({
//  networkInterface,
// });

const postListQuery = gql`
  query PostsListQuery {
    posts(limit:100,offset:5){
      id
      title
      text
    }
  }
`;

export const PostListWithData = graphql(postListQuery)(PostList);

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to Apollo Blog</h2>
          </div>
          {/* <PostList
            data={{
              loading: false,
              posts: [
                { id: 1, title: 'title1', text: 'Text' },
                { id: 2, title: 'title2', text: 'Text 2' },
              ],
            }}
          />*/}
          <PostListWithData />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
