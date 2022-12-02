import { execSync } from "child_process";
import { IdependenciesItem } from "../../../@types";
import ora from "ora";
import chalk from "chalk";
const sourceSpinner = ora("");
export const BinaryHelper = {
  upgradeChangedPkg: (
    pkgArr: IdependenciesItem[],
    npmClient: string,
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
      console.log(`Start install package: ${chalk.red(pkgWithVer)}`);
      // default npm
      // when npm install, ^ is preferred then ~
      switch (npmClient) {
        case "yarn":
          execSync(`yarn add ${pkgWithVer} ${devFlag ? "--dev" : ""}`, {
            stdio: "inherit",
          });
          break;
        case "pnpm":
          execSync(
            `pnpm install ${pkgWithVer} ${devFlag ? "--save-dev" : "--save"}`,
            {
              stdio: "inherit",
            }
          );
          break;
        default:
          execSync(
            `npm install ${pkgWithVer} ${devFlag ? "--save-dev" : "--save"}`,
            {
              stdio: "inherit",
            }
          );
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  canUseYarn: (): boolean => {
    try {
      execSync("yarn --version", { stdio: "ignore" });
      return true;
    } catch (e) {
      return false;
    }
  },
  canUsePnpm: (): boolean => {
    try {
      execSync("pnpm --version", { stdio: "ignore" });
      return true;
    } catch (e) {
      return false;
    }
  },
};
