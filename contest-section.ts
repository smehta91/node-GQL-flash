import { ExpressContext } from "apollo-server-express";
import { defaultHeaders, nativePostRequest } from "./utils/request";

const doNotShowContestSections = (round: any) => {
  const roundStartTime = new Date(round.round.RoundStartTime).getTime();
  const now = Date.now();
  return (
    (round.round.DisplayStatus === 3 && roundStartTime < now) ||
    (round.round.DisplayStatus === 0 && roundStartTime > now)
  );
};

const getSections = (context: ExpressContext, args: any) => {
  return nativePostRequest(
    "/contest-list",
    {
      ...defaultHeaders,
      siteId: args.siteId,
    },
    args
  );
};
// const getRoundInfo = (context: ExpressContext, args: any) => {
//   return nativePostRequest("/round", defaultHeaders, {
//     site: args.site,
//     roundId: args.roundId,
//   });
// };

const getJoinedLeaguesBeforeRoundLock = async (
  context: ExpressContext,
  args: any
) => {
  try {
    const requestArgs = {
      ...args,
      site: "cricket",
      tourId: 123,
      contestDB: "voltdb2",
      roundCalcStatus: 0,
      pcStreamingStatus: 0,
      pcStack: "classic",
      isRoundComplete: 0,
      isRoundLocked: 0,
      isArchive: 0,
    };
    if (false) {
      // post round lock
    } else {
      // pre round lock
      ///contest/v1/fetchJoinedContestsLite
      return nativePostRequest(
        "/contest/v1/fetchJoinedContestsLite",
        {
          ...defaultHeaders,
          siteId: args.siteId,
        },
        requestArgs
      );
    }
  } catch {
    throw "round failed";
  }
};

export const fetchContestSectionAndJoinedLeagues = async (
  context: ExpressContext,
  args: any,
  round: any
) => {
  const defaultPayload = [{ sections: [] }, {}];
  if (doNotShowContestSections(round)) {
    return defaultPayload;
  }
  return Promise.all([
    getSections(context, args),
    getJoinedLeaguesBeforeRoundLock(context, args),
  ]);
};
