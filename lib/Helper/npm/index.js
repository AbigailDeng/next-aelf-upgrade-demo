"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_potential_package_managers = void 0;
var _binary = require("../binary");
const get_potential_package_managers = () => {
  const pmQuestionChoises = [{
    title: "Npm",
    value: "npm"
  }];
  const canUseYarn = _binary.BinaryHelper.canUseYarn();
  const canUsePnpm = _binary.BinaryHelper.canUsePnpm();
  if (canUseYarn) {
    pmQuestionChoises.push({
      title: "Yarn",
      value: "yarn"
    });
  }
  if (canUsePnpm) {
    pmQuestionChoises.push({
      title: "pnpm".split("").map(v => Math.round(Math.random()) ? v.toUpperCase() : v.toLowerCase()).join(""),
      value: "pnpm"
    });
  }
  return pmQuestionChoises;
};
exports.get_potential_package_managers = get_potential_package_managers;