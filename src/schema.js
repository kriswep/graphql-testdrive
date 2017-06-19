// This example demonstrates a simple server with some
// relational data: Posts and Authors. You can get the
// posts for a particular author, and vice-versa

// Read the complete docs for graphql-tools here:
// http://dev.apollodata.com/tools/graphql-tools/generate-schema.html

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }

  type Post {
    id: Int!
    title: String
    text: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    user: Author,
    posts(offset: Int!, limit: Int!, id: Int, title: String, text: String): [Post]
    post(id: Int!): Post
    authors(offset: Int!, limit: Int!, id: Int, firstName: String, lastName: String): [Author]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

export default typeDefs;
