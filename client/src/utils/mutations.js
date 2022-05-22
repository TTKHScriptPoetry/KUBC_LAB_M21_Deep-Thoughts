import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_FRIEND = gql`
mutation AddFriend($friendId: ID!) {
  addFriend(friendId: $friendId) {
    _id
    username
    friends {
      _id
      username
      email
    }
  }
}
`;

export const ADD_THOUGHT = gql`
  mutation AddThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation AddReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;