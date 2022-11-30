import { execSync } from "child_process";
import { IdependenciesItem } from "../../../@types";
export const BinaryHelper = {
  upgradeChangedPkg: (
    pkgArr: IdependenciesItem[],
    devFlag?: boolean
  ): boolean => {
    try {
      let pkgWithVer = "";
      pkgArr.forEach((ele, index) => {
        let key = Object.keys(ele)[0],
          value = ele[key];
        let item = `${key}@${value}`;
        pkgWithVer += ` ${item}`;
      });
      console.log(pkgWithVer);
      execSync(`yarn add ${pkgWithVer} ${devFlag ? "--dev" : ""}`, {
        stdio: "ignore",
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};
