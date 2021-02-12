const Matchstatus = [
    '',
    '',
    'In progress',
    'Completed',
    'Waiting for review',
    'Abandoned'
  ]
export const contestCompute = (apiResponse: any, contest: any, args: any) => {
  return {
    id: contest["contestId"],
    contestName: contest["contestName"],
    contestCategory: contest["contestCategory"],
    contestType: contest["contestType"],
    contestSize: contest["contestSize"],
    currentSize: contest["currentSize"],
    inviteCode: contest["inviteCode"],
    isInfiniteEntry: contest["contestSize"] > 10000000,
    isPartnerContest: ["x", "y", "z"].indexOf(contest["contestName"]) > -1,
    isGuaranteed: contest["isGuaranteed"] === 1,
    isMultipleEntry: contest["multipleEntry"],
    prizeDisplayText: contest["prizeAmount"] ? contest["prizeAmount"] : 0, // amount to word
    numberOfWinners: contest["noOfWinners"],
    site: args.site,
    // hasJoined: !!apiResponse.joinedContest.joinedContests.find(
    //   (joinedCnts: any) => joinedCnts["contestId"] === contest["contestId"]
    // ),
    hasJoined: false,
    entryFee: {
      code: "INR",
      symbol: "INR",
      amount: contest["entryFee"],
    },
    prizeAmount: {
      code: "INR",
      symbol: "INR",
      amount: contest["prizeAmount"],
    },
    effectiveEntryFee:
      contest["promotionsDetails"] &&
      contest["promotionsDetails"]["minReducedEntryFee"]
        ? {
            code: "INR",
            symbol: "INR",
            amount: contest["promotionsDetails"]["minReducedEntryFee"],
          }
        : null,
    match: {
        id: args.matchId,
        status: Matchstatus[apiResponse['roundTourSquad']['round']['RoundCalcStatus']]
    },
    tour: {
        id: args.tourId,
        name: apiResponse['roundTourSquad']['tour']['TourName']
      }
  };
};
