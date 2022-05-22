import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query User($username: String!) {
  user(username: $username) {
    _id
    username
    email
    friendCount
    friends {
      _id
      username
    }
    thoughts {
      _id
      thoughtText
      createdAt
      reactionCount
    }
  }
}
`;

// Similar to query we wrote using the Apollo Studio Explorer,
// Import this query function by name and use it anywhere we need
export const QUERY_THOUGHTS = gql`
  query Thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      username
      createdAt
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }

`;

// the cache of this query's result is to be updated via useMutation Hook update-function
export const QUERY_THOUGHT = gql`
  query Thought($id: ID!) {
    thought(_id: $id) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }  
`;

// We aren't passing any variables to it
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

// With GraphQL, we can reuse the same query we created and simply ask for less.
export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;