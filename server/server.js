const express = require('express');

// import apollo 
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// import parts of the graphQL schema
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require("./utils/auth");
const db = require('./config/connection');
const PORT = process.env.PORT || 3000;

// define apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// idk what this means but sure
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// create new instance of apollo server with graphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });

}

startApolloServer(typeDefs, resolvers);
