import { ApolloServer } from "apollo-server-express";
import express = require("express");
import { Schema } from "./schema-builder";

const app = express();

const apolloServer = new ApolloServer({
  schema: Schema,
  context: (expressContext) => {
    return expressContext;
  },
  playground: true,
});
apolloServer.applyMiddleware({ app });
app.get("/health", (request: any, response: any) => {
  return response.json({ status: "Success" });
});

app.listen(1452);
