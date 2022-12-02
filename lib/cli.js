"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _clear = _interopRequireDefault(require("clear"));
var _commander = _interopRequireDefault(require("commander"));
var _chalk = _interopRequireDefault(require("chalk"));
var _ora = _interopRequireDefault(require("ora"));
var _fs = require("fs");
var _package = _interopRequireDefault(require("../package.json"));
var _Helper = require("./Helper");
var _Constants = require("./Constants");
var _prompts = _interopRequireDefault(require("prompts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// get remote and local pkg from package.json
const getPkgObj = cloneResponse => {
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
// npmClient choices
const packageManagerChoices = (0, _Helper.get_potential_package_managers)();
const cli = async () => {
  // clear the terminal screen
  (0, _clear.default)();
  const program = _commander.default.name(_package.default.name).version(_package.default.version).option("-b, --branch <source-git-branch>", "specify a custom branch in source of next-aelf").on("--help", () => {
    console.log(`  - if you don't want to upgrade to latest version, you can also define a custom branch in it: ${_chalk.default.green("--branch canary or -b canary")}`);
  }).parse(process.argv);
  const cloneResponse = await (0, _Helper.get_source)(program.branch);
  const sourceSpinner = (0, _ora.default)("");
  sourceSpinner.info(`temporary dir: ${cloneResponse}`);
  const {
    curr,
    prev
  } = getPkgObj(cloneResponse);
  // delete remote dir
  const deleteResponse = _Helper.FileHelper.removeDir(cloneResponse);
  if (deleteResponse) {
    sourceSpinner.succeed("delete temporary dir successfully.");
  }
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
var _default = cli;
exports.default = _default;