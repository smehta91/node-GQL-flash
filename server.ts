import { ApolloServer } from "apollo-server-express";
import express = require("express");
import { Schema } from "./schema-builder";

const app = express();

const apolloServer = new ApolloServer({
  schema: Schema,
  //   context: (expressContext: ExpressContext) => {
  //     const newHttp = {
  //       post: http.post(expressContext.req, expressContext.res),
  //       doRequest: http.doRequest(expressContext.req, expressContext.res),
  //     };
  //     expressContext.req._defaultIO = { HTTP: newHttp };
  //     expressContext.req._loaders = {};
  //     expressContext.req.response = expressContext.res;
  //     return expressContext.req;
  //   },
  playground: true,
});
apolloServer.applyMiddleware({ app });
app.get("/health", (request: any, response: any) => {
  return response.json({ status: "Success" });
});

app.listen(1452);
