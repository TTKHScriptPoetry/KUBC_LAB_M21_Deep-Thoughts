const express = require('express');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express'); // import ApolloServer
const { typeDefs, resolvers } = require('./schemas'); // import our typeDefs and resolvers
const { authMiddleware } = require('./utils/auth');
const path = require('path');

const PORT = process.env.PORT || 3003;
// create a new instance of Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers, 
  
  // -- pass in a context method that sees the - coming request - and returns only the headers
  // context: ({ req }) => req.headers
 
  // On the resolver side, those headers would become the context parameter.
  context: authMiddleware // get the real backend where the request arrives to look for the token in the request
  // token can be extracted from req.body.token || req.query.token || req.headers.authorization;
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app }); // integrate our Apollo server with the Express application as middleware - importatnt
  // --> create a special /graphql endpoint for the Express.js server that will serve as the main endpoint

// -- Update the back-end server's code to serve up the React front-end code in production
// -- Check to see if the Node environment is in productionb - Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// -- If GET request sent to any location on the server that doesn't have an explicit route defined
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html')); // respond with the production-ready React front-end code.
});

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);  // log where we can go to test our GQL API     
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); // create a special graphql endpoint
    })
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);

// see package.json
// concurrently "cd server && npm run watch" "cd client && npm start"
 
