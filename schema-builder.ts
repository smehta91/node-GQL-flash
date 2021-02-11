import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import * as path from "path";
import { makeExecutableSchema } from "apollo-server-express";

const ROOT_SCHEMA_PATH = path.resolve(__dirname, "./schemas");

export const resolvers = () => {
  return {
    Query: {
      contestSections: () => ([{
        id: 123,
        name: "section",
        description: "section description",
        totalContestCount: 10,
        displayContestCount: 1,
      }]),
    },
  };
};

const typeDefinition = mergeTypeDefs(loadFilesSync(ROOT_SCHEMA_PATH));

export const Schema = makeExecutableSchema({
  typeDefs: [typeDefinition],
  resolvers: resolvers(),
});
