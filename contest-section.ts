import { ExpressContext } from "apollo-server-express";
import { nativePostRequest } from "./utils/request";

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
      "Content-Type": "application/json",
      Cookie:
        "G_ENABLED_IDPS=google; ajs_user_id=%2212091906-01011992%22; ajs_anonymous_id=%2214e5ca11-ac80-44a6-b4c3-af677d9fa4d4%22; X-Experiment=amp-CW95Kif8JlrEQ5rZ7tZJLA; __csrf=562ce1fa-f485-b7ef-7942-a2cbc284645d; WZRK_G=5a326cd9a7884acdb2e9bb2ddf15ff74; tId=1551; mId=22394; _ga_6NJVXEJHSD=GS1.1.1605099018.3.0.1605099018.0; _ga=GA1.1.1386338343.1602142190; dh_user_id=3c7c2ec0-5700-11eb-b5f8-b930fc089175; G_AUTHUSER_H=1; connect.sid=s%3A_rS1ZMC1xoRVJUW2CWyv-wRlAYbDSDFZ.lsW1u5qf%2BY3fGXd1bOTp2lQfv%2BMKi%2FYeUJbpsRfRIj0; IPL_Offer=variant3; WZRK_S_W4R-49K-494Z=%7B%22p%22%3A1%2C%22s%22%3A1612963862%2C%22t%22%3A1612963862%7D",
      "x-csrf": "562ce1fa-f485-b7ef-7942-a2cbc284645d",
      siteId: args.siteId,
    },
    args
  );
};
const getRoundInfo = (context: ExpressContext, args: any) => {
  return nativePostRequest(
    "/round",
    { "Content-Type": "application/json" },
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
          "Content-Type": "application/json",
          Cookie:
            "G_ENABLED_IDPS=google; ajs_user_id=%2212091906-01011992%22; ajs_anonymous_id=%2214e5ca11-ac80-44a6-b4c3-af677d9fa4d4%22; X-Experiment=amp-CW95Kif8JlrEQ5rZ7tZJLA; __csrf=562ce1fa-f485-b7ef-7942-a2cbc284645d; WZRK_G=5a326cd9a7884acdb2e9bb2ddf15ff74; tId=1551; mId=22394; _ga_6NJVXEJHSD=GS1.1.1605099018.3.0.1605099018.0; _ga=GA1.1.1386338343.1602142190; dh_user_id=3c7c2ec0-5700-11eb-b5f8-b930fc089175; G_AUTHUSER_H=1; connect.sid=s%3A_rS1ZMC1xoRVJUW2CWyv-wRlAYbDSDFZ.lsW1u5qf%2BY3fGXd1bOTp2lQfv%2BMKi%2FYeUJbpsRfRIj0; IPL_Offer=variant3; WZRK_S_W4R-49K-494Z=%7B%22p%22%3A1%2C%22s%22%3A1612963862%2C%22t%22%3A1612963862%7D",
          "x-csrf": "562ce1fa-f485-b7ef-7942-a2cbc284645d",
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
