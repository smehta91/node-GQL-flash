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
const getRoundInfo = (context: ExpressContext, args: any) => {
  return nativePostRequest(
    "/round",
    defaultHeaders,
    { site: args.site, roundId: args.roundId }
  );
};

const getJoinedLeaguesBeforeRoundLock = async (
  context: ExpressContext,
  args: any
) => {
  try {
    const roundInfo = await getRoundInfo(context, args);
    const roundObj = roundInfo.round;
    const requestArgs = {
      ...args,
      site: args.site,
      tourId: roundObj.tourId,
      contestDB: roundObj.contestDB,
      roundCalcStatus: roundObj.RoundCalcStatus,
      pcStreamingStatus: roundInfo.summary.pcStreamingStatus,
      pcStack: roundInfo.summary.pcStack,
      isRoundComplete:
        roundObj.RoundCalcStatus === 3 || roundObj.RoundCalcStatus === 5 ? 1 : 0, //check if time check necessary
      isRoundLocked: roundObj.DisplayStatus === 3 ? 1 : 0, //check if time check necessary,
      isArchive: roundObj.IsArchive
    };
    if (
      roundInfo.summary &&
      roundInfo.summary.PCStatus &&
      Number(roundInfo.summary.PCStatus) >= 2
    ) {
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
