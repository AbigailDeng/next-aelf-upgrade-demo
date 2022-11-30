import { IdependenciesItem } from "../../../@types";

export const DiffHelper = {
  diffObjWithKeys: (
    curr: IdependenciesItem,
    prev: IdependenciesItem,
    keys: string[]
  ): IdependenciesItem[] => {
    const res: IdependenciesItem[] = [];
    keys.forEach((ele) => {
      if (prev[ele] !== curr[ele] && curr[ele]) {
        res.push({
          [ele]: curr[ele],
        });
      }
    });
    return res;
  },
};
