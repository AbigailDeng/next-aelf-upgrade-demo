"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinaryHelper = void 0;
var _child_process = require("child_process");
var _ora = _interopRequireDefault(require("ora"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const sourceSpinner = (0, _ora.default)("");
const BinaryHelper = {
  upgradeChangedPkg: (pkgArr, devFlag) => {
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
      (0, _child_process.execSync)(`yarn add ${pkgWithVer} ${devFlag ? "--dev" : ""}`, {
        stdio: "inherit"
      });
      return true;
    } catch (e) {
      return false;
    }
  }
};
exports.BinaryHelper = BinaryHelper;