"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;
var _ora = _interopRequireDefault(require("ora"));
var _fs = require("fs");
var _Helper = require("./Helper");
var _Constants = require("./Constants");
var _prompts = _interopRequireDefault(require("prompts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getPkgObj = cloneResponse => {
  // const pkgCurr = readFileSync(
  //   `${cloneResponse.trim()}/web/next-aelf/package.json`,
  //   "utf-8"
  // );
  const pkgCurr = (0, _fs.readFileSync)(`${cloneResponse.trim()}/package.json`, "utf-8");
  const pkgPrev = (0, _fs.readFileSync)("package.json", "utf-8");
  const curr = {
    ...JSON.parse(pkgCurr).dependencies,
    ...JSON.parse(pkgCurr).devDependencies
  };
  const prev = {
    ...JSON.parse(pkgPrev).dependencies,
    ...JSON.parse(pkgPrev).devDependencies
  };
  return {
    curr,
    prev
  };
};
const packageManagerChoices = (0, _Helper.get_potential_package_managers)();
const init = async () => {
  const sourceSpinner = (0, _ora.default)("");
  const sourcePath = "https://github.com/AElfProject/aelf-boilerplate.git";
  const branch = "feature/next-aelf";
  // const cloneResponse = await GitHelper.CloneAndGetPath(sourcePath, branch);
  const cloneResponse = "/Users/xiezixin/Documents/work/test-2";
  sourceSpinner.info(`temporary dir: ${cloneResponse}`);
  const {
    curr,
    prev
  } = getPkgObj(cloneResponse);
  // // delete remote dir
  // const deleteResponse = FileHelper.removeDir(cloneResponse);
  // if (deleteResponse) {
  //   sourceSpinner.succeed("delete temporary dir successfully.");
  // }
  const question = [{
    type: "select",
    name: "npmClient",
    message: "Choose a package manager:",
    choices: packageManagerChoices,
    default: packageManagerChoices.length === 1 ? packageManagerChoices[0].value : undefined,
    skip: () => packageManagerChoices.length === 1
  }];
  const {
    npmClient
  } = await (0, _prompts.default)(question);
  const upgradeDep = _Helper.DiffHelper.diffObjWithKeys(curr, prev, _Constants.UPGRADE_DEP);
  const upgradeDevDep = _Helper.DiffHelper.diffObjWithKeys(curr, prev, _Constants.UPGRADE_DEV_DEP);
  const depResponse = _Helper.BinaryHelper.upgradeChangedPkg(upgradeDep, npmClient);
  const devDepResponse = _Helper.BinaryHelper.upgradeChangedPkg(upgradeDevDep, npmClient, true);
  if (depResponse && devDepResponse) {
    sourceSpinner.succeed("Upgrade package successfully.");
  }
};
// init();
exports.init = init;