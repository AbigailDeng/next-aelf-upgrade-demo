"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinaryHelper = void 0;
var _child_process = require("child_process");
const BinaryHelper = {
  upgradeChangedPkg: (pkgArr, devFlag) => {
    try {
      let pkgWithVer = "";
      pkgArr.forEach((ele, index) => {
        let key = Object.keys(ele)[0],
          value = ele[key];
        let item = `${key}@${value}`;
        pkgWithVer += ` ${item}`;
      });
      console.log(pkgWithVer);
      (0, _child_process.execSync)(`yarn add ${pkgWithVer} ${devFlag ? "--dev" : ""}`, {
        stdio: "ignore"
      });
      return true;
    } catch (e) {
      return false;
    }
  }
};
exports.BinaryHelper = BinaryHelper;