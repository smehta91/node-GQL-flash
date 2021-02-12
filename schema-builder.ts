import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import * as path from "path";
import { ExpressContext, makeExecutableSchema } from "apollo-server-express";
import { defaultHeaders, nativePostRequest } from "./utils/request";
import { fetchContestSectionAndJoinedLeagues } from "./contest-section";
import { contestSectionMapper } from "./contest-section-compute";

const ROOT_SCHEMA_PATH = path.resolve(__dirname, "./schemas");

const SITE_ID_MAP = {
  cricket: 1,
  basketball: 37,
  nba: 39,
  "nba-basketball": 39,
  "isl-fantasy": 38,
  football: 10,
  kabaddi: 34,
  "pkl-fantasy": 40,
  "icc-fantasy": 41,
  hockey: 42,
  "bbl-fantasy": 43,
  "mbbl-fantasy": 53,
  "ipl-fantasy": 44,
  volleyball: 45,
  nfl: 46,
  "supersmash-fantasy": 47,
  futsal: 48,
  baseball: 49,
  handball: 50,
  "onboarding-experiment": 51,
};

type ContestSectionsArgs = {
  site: keyof typeof SITE_ID_MAP;
  matchId: number;
  tourId: number;
  withPromotions?: boolean;
};

export const resolvers = () => {
  return {
    Query: {
      contestSections: async (
        parent: unknown,
        args: ContestSectionsArgs,
        context: ExpressContext,
        info: unknown
      ) => {
        // const arguments = {
        //   siteId: SITE_ID_MAP[args.site],
        //   site: args.site,
        //   tourId: args.tourId,
        //   roundId: args.matchId,
        // };
        const roundRequestData = {
          roundId: args.matchId,
          site: args.site,
        };
        try {
          const roundTourSquad = await nativePostRequest(
            "/roundTourSquad",
            defaultHeaders,
            roundRequestData
          );
          const roundInfo = {
            round: roundTourSquad["round"],
            currentDateTime: Date.now(),
          };
          const contestSections = await fetchContestSectionAndJoinedLeagues(
            context,
            {
              site: args.site,
              roundId: args.matchId,
              siteId: SITE_ID_MAP[args.site],
              tourId: args.tourId,
            },
            roundInfo
          );
          const apiResponse = {
            sections: contestSections[0],
            joinedContest: contestSections[0],
            roundTourSquad: roundTourSquad,
          };
          const sections = [];
          for (let i = 0; i < contestSections[0].data.sections.length; i++) {
            sections.push(
              contestSectionMapper(
                apiResponse,
                contestSections[0].data.sections[i],
                args
              )
            );
          }
          return sections;
        } catch {
          return [];
        }
      },
    },
  };
};

const typeDefinition = mergeTypeDefs(loadFilesSync(ROOT_SCHEMA_PATH));

export const Schema = makeExecutableSchema({
  typeDefs: [typeDefinition],
  resolvers: resolvers(),
});
