import { contestCompute } from "./contest-compute";

const SORT_FIELD = ["PRIZEAMOUNT", "CONTESTSIZE", "ENTRYAMOUNT", "WINNER"];
const getSortField = (sortField: string) => {
  const sortFieldCap = sortField.toUpperCase();
  return sortField && SORT_FIELD.indexOf(sortFieldCap) > -1
    ? sortFieldCap
    : null;
};
export const contestSectionMapper = (
  apiResponse: any,
  section: any,
  args: any
) => {
  const sectionConfig = section.sectionConfig
    ? section.sectionConfig
    : {};
  const displayContests = [contestCompute(apiResponse, section.leagues[0], args)]
  for(let i=1; i< sectionConfig.showCardCount; i++) {
    displayContests.push(contestCompute(apiResponse, section.leagues[i], args))
  }
  return {
    id: sectionConfig.id,
    name: sectionConfig.title,
    description: sectionConfig.subTitle,
    artwork: [{ src: sectionConfig.imgURL }],
    totalContestCount: sectionConfig.totalCardCount,
    displayContestCount: sectionConfig.showCardCount,
    sortField: getSortField(sectionConfig.sortField),
    sortType: sectionConfig.sortOrderAsc === 0 ? "DESC" : "ASC",
    displayContests: displayContests,
    contests: [],
    tag: null,
    contestsDisplayOrder: sectionConfig.contestsDisplayOrder
      ? sectionConfig.contestsDisplayOrder
      : "VERTICAL",
  };
};
