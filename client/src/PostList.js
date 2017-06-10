import React from 'react';

const PostList = ({ data: { loading, error, posts } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div>
      {posts.map(post =>
        (<article key={post.id}>
          <header>
            <h1>{post.title}</h1>
          </header>
          <section>{post.text}</section>
        </article>),
      )}
    </div>
  );
};

export default PostList;
