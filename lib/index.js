"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;
var _ora = _interopRequireDefault(require("ora"));
var _fs = require("fs");
var _Helper = require("./Helper");
var _Constants = require("./Constants");
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
const init = async () => {
  const sourceSpinner = (0, _ora.default)("");
  // const sourcePath = "https://github.com/AElfProject/aelf-boilerplate.git";
  // const branch = "feature/next-aelf";
  // const cloneResponse = await GitHelper.CloneAndGetPath(sourcePath, branch);
  const cloneResponse = "/Users/xiezixin/Documents/work/test-2";
  sourceSpinner.info(`temporary dir: ${cloneResponse}`);
  const {
    curr,
    prev
  } = getPkgObj(cloneResponse);
  // delete remote dir
  // const deleteResponse = FileHelper.removeDir(cloneResponse);
  // if (deleteResponse) {
  //   sourceSpinner.succeed("delete temporary dir successfully.");
  // }
  const upgradeDep = _Helper.DiffHelper.diffObjWithKeys(curr, prev, _Constants.UPGRADE_DEP);
  const upgradeDevDep = _Helper.DiffHelper.diffObjWithKeys(curr, prev, _Constants.UPGRADE_DEV_DEP);
  const depResponse = _Helper.BinaryHelper.upgradeChangedPkg(upgradeDep);
  const devDepResponse = _Helper.BinaryHelper.upgradeChangedPkg(upgradeDevDep, true);
  if (depResponse && devDepResponse) {
    sourceSpinner.succeed("Upgrade package successfully.");
  }
};
// init();
exports.init = init;