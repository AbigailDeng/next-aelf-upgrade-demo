import { execSync } from "child_process";
import { IdependenciesItem } from "../../../@types";
import ora from "ora";
const sourceSpinner = ora("");
export const BinaryHelper = {
  upgradeChangedPkg: (
    pkgArr: IdependenciesItem[],
    devFlag?: boolean
  ): boolean => {
    try {
      if (!pkgArr.length) {
        sourceSpinner.info(
          `no ${
            devFlag ? "devDependencies" : "dependencies"
          } package to upgrade`
        );
        return true;
      }
      let pkgWithVer = "";
      pkgArr.forEach((ele) => {
        let key = Object.keys(ele)[0],
          value = ele[key];
        let item = `${key}@${value}`;
        pkgWithVer += ` ${item}`;
      });
      execSync(`yarn add ${pkgWithVer} ${devFlag ? "--dev" : ""}`, {
        stdio: "inherit",
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};
