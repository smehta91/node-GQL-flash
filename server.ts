const uws = require("uWebSockets.js");
const gql = require("graphql");
import { Schema } from "./schema-builder";

const { graphql } = gql;

uws
  .App()
  .post("/graphql", async (res: any, req: any) => {
    res.onAborted(() => {
      throw new Error("Aborted");
    });
    const contentType = req.getHeader("content-type");
    const body = await readBody(res);
    let query, variables;
    if (contentType === "application/json") {
      try {
        ({ query, variables } = JSON.parse(body as string));
      } catch (e) {
        console.error("JSON.parse", e);
        res.writeStatus("400");
        return res.end(JSON.stringify({ name: e.name, message: e.message }));
      }
    }
    const response = await graphql(Schema, query, {}, {}, variables);
    res.end(JSON.stringify(response));
  })
  .listen(4001, () => {});

const readBody = (res: any) =>
  new Promise((resolve) => {
    let buffer: any;
    res.onData((ab: any, isLast: any) => {
      const chunk = Buffer.from(ab);
      buffer = buffer ? Buffer.concat([buffer, chunk]) : chunk;
      if (!isLast) return;
      resolve(buffer.toString());
    });
  });
