// -- Import the gql tagged template function
// Tagged templates are an advanced use of template literals, and were introduced with ES6 as well
const { gql } = require('apollo-server-express'); 

// -- Create our typeDefs, all type definitions need to specify what type of data is expected in return
// we created a query named helloWorld (as a function)
// type of data to be returned by this query will be a string.

// const typeDefs = gql`
//   type Query {  
//     helloWorld: String
//   }
// `;

// https://www.apollographql.com/docs/apollo-server/schema/schema/

// The sign ! indicates that for that query to be carried out, that data must exist
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Query {
    me: User
    users: [User]
    oneuser(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought

    getAllUsers: [User]
    getUserByUserName (username: String!): User
    getAllThoughtsByUsernameOptionBlank (username: String): [Thought]
    getThoughtById (_id: ID!): Thought
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }
 
`;

// type Mutation {
//   login(email: String!, password: String!): User
//   addUser(username: String!, email: String!, password: String!): User
// }

// type Query {
//   getAllUsers: [User]
//   getUserByUserName (username: String!): User
//   getThoughtsByUsername (username: String): [Thought]
//   getThoughtById (_id: ID!): Thought
// }

module.exports = typeDefs;