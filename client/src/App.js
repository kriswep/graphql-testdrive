import React, { Component } from 'react';
import {
  ApolloClient,
  gql,
  graphql,
  ApolloProvider,
  createNetworkInterface, // for live server
} from 'react-apollo';
// for mocked server
// import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';

// import { typeDefs } from '../../src/schema';
// import typeDefs from './schema';

import PostList from './PostList';

import './App.css';

// Tut from here https://dev-blog.apollodata.com/full-stack-react-graphql-tutorial-582ac8d24e3b?_ga=2.249254087.1991559453.1497035474-344072256.1490729773

// for mocked server
// const schema = makeExecutableSchema({ typeDefs });
// addMockFunctionsToSchema({ schema });
// const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

// const client = new ApolloClient({
//   networkInterface: mockNetworkInterface,
// });

const postListQuery = gql`
  query PostsListQuery {
    posts(limit:100,offset:5){
      id
      title
      text
      votes
    }
  }
`;

export const PostListWithData = graphql(postListQuery)(PostList);

export const addAuthHeader = props => ({
  applyMiddleware(req, next) {
    if (props.auth.isAuthenticated()) {
      if (!req.options.headers) {
        req.options.headers = {}; // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      const token = props.auth.getAccessToken();
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
    }
    next();
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  constructor(props) {
    super(props);

    // for live server
    const networkInterface = createNetworkInterface({
      uri: 'http://localhost:3000/graphql',
    });

    networkInterface.use([addAuthHeader(props)]);

    this.client = new ApolloClient({
      networkInterface,
    });
  }
  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <ApolloProvider client={this.client}>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to Apollo Blog</h2>
            <button onClick={this.goTo.bind(this, 'home')}>
              Home
            </button>
            {!isAuthenticated() &&
              <button onClick={this.login.bind(this)}>
                Log In
              </button>}
            {isAuthenticated() &&
              <button onClick={this.logout.bind(this)}>
                Log Out
              </button>}
          </div>
          <PostListWithData />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
