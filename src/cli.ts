import clear from "clear";
import commander from "commander";
import chalk from "chalk";
import ora from "ora";
import { readFileSync } from "fs";
import packageData from "../package.json";
import {
  DiffHelper,
  BinaryHelper,
  FileHelper,
  get_potential_package_managers,
  get_source,
} from "./Helper";
import { UPGRADE_DEP, UPGRADE_DEV_DEP } from "./Constants";
import prompts, { PromptType } from "prompts";
// get remote and local pkg from package.json
const getPkgObj = (cloneResponse: string) => {
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
// npmClient choices
const packageManagerChoices = get_potential_package_managers();
const cli = async (): Promise<void> => {
  // clear the terminal screen
  clear();
  const program = commander
    .name(packageData.name)
    .version(packageData.version)
    .option(
      "-b, --branch <source-git-branch>",
      "specify a custom branch in source of next-aelf"
    )
    .on("--help", () => {
      console.log(
        `  - if you don't want to upgrade to latest version, you can also define a custom branch in it: ${chalk.green(
          "--branch canary or -b canary"
        )}`
      );
    })
    .parse(process.argv);
  const cloneResponse = await get_source(program.branch);
  const sourceSpinner = ora("");
  sourceSpinner.info(`temporary dir: ${cloneResponse}`);
  const { curr, prev } = getPkgObj(cloneResponse);
  // delete remote dir
  const deleteResponse = FileHelper.removeDir(cloneResponse);
  if (deleteResponse) {
    sourceSpinner.succeed("delete temporary dir successfully.");
  }
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
export default cli;
