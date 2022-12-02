"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinaryHelper = void 0;
var _child_process = require("child_process");
var _ora = _interopRequireDefault(require("ora"));
var _chalk = _interopRequireDefault(require("chalk"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const sourceSpinner = (0, _ora.default)("");
const BinaryHelper = {
  upgradeChangedPkg: (pkgArr, npmClient, devFlag) => {
    try {
      if (!pkgArr.length) {
        sourceSpinner.info(`no ${devFlag ? "devDependencies" : "dependencies"} package to upgrade`);
        return true;
      }
      let pkgWithVer = "";
      pkgArr.forEach(ele => {
        let key = Object.keys(ele)[0],
          value = ele[key];
        let item = `${key}@${value}`;
        pkgWithVer += ` ${item}`;
      });
      console.log(`Start install package: ${_chalk.default.red(pkgWithVer)}`);
      // default npm
      // when npm install, ^ is preferred then ~
      switch (npmClient) {
        case "yarn":
          (0, _child_process.execSync)(`yarn add ${pkgWithVer} ${devFlag ? "--dev" : ""}`, {
            stdio: "inherit"
          });
          break;
        case "pnpm":
          (0, _child_process.execSync)(`pnpm install ${pkgWithVer} ${devFlag ? "--save-dev" : "--save"}`, {
            stdio: "inherit"
          });
          break;
        default:
          (0, _child_process.execSync)(`npm install ${pkgWithVer} ${devFlag ? "--save-dev" : "--save"}`, {
            stdio: "inherit"
          });
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  canUseYarn: () => {
    try {
      (0, _child_process.execSync)("yarn --version", {
        stdio: "ignore"
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  canUsePnpm: () => {
    try {
      (0, _child_process.execSync)("pnpm --version", {
        stdio: "ignore"
      });
      return true;
    } catch (e) {
      return false;
    }
  }
};
exports.BinaryHelper = BinaryHelper;