import ora from "ora";
import { readFileSync } from "fs";
import {
  GitHelper,
  DiffHelper,
  BinaryHelper,
  FileHelper,
  get_potential_package_managers,
} from "./Helper";
import { UPGRADE_DEP, UPGRADE_DEV_DEP } from "./Constants";
import prompts, { PromptType } from "prompts";
const getPkgObj = (cloneResponse: string) => {
  // const pkgCurr = readFileSync(
  //   `${cloneResponse.trim()}/web/next-aelf/package.json`,
  //   "utf-8"
  // );
  const pkgCurr = readFileSync(`${cloneResponse.trim()}/package.json`, "utf-8");
  const pkgPrev = readFileSync("package.json", "utf-8");
  const curr = {
    ...JSON.parse(pkgCurr).dependencies,
    ...JSON.parse(pkgCurr).devDependencies,
  };
  const prev = {
    ...JSON.parse(pkgPrev).dependencies,
    ...JSON.parse(pkgPrev).devDependencies,
  };
  return {
    curr,
    prev,
  };
};
const packageManagerChoices = get_potential_package_managers();
export const init = async () => {
  const sourceSpinner = ora("");
  const sourcePath = "https://github.com/AElfProject/aelf-boilerplate.git";
  const branch = "feature/next-aelf";
  // const cloneResponse = await GitHelper.CloneAndGetPath(sourcePath, branch);
  const cloneResponse = "/Users/xiezixin/Documents/work/test-2";
  sourceSpinner.info(`temporary dir: ${cloneResponse}`);
  const { curr, prev } = getPkgObj(cloneResponse);
  // // delete remote dir
  // const deleteResponse = FileHelper.removeDir(cloneResponse);
  // if (deleteResponse) {
  //   sourceSpinner.succeed("delete temporary dir successfully.");
  // }
  const question = [
    {
      type: "select" as PromptType,
      name: "npmClient",
      message: "Choose a package manager:",
      choices: packageManagerChoices,
      default:
        packageManagerChoices.length === 1
          ? packageManagerChoices[0].value
          : undefined,
      skip: () => packageManagerChoices.length === 1,
    },
  ];
  const { npmClient } = await prompts(question);

  const upgradeDep = DiffHelper.diffObjWithKeys(curr, prev, UPGRADE_DEP);
  const upgradeDevDep = DiffHelper.diffObjWithKeys(curr, prev, UPGRADE_DEV_DEP);

  const depResponse = BinaryHelper.upgradeChangedPkg(upgradeDep, npmClient);
  const devDepResponse = BinaryHelper.upgradeChangedPkg(
    upgradeDevDep,
    npmClient,
    true
  );
  if (depResponse && devDepResponse) {
    sourceSpinner.succeed("Upgrade package successfully.");
  }
};
// init();
