"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlHelper = void 0;
var _validUrl = require("valid-url");
const UrlHelper = {
  IsUrl: path => {
    return !!(0, _validUrl.isUri)(path);
  },
  GetGitUrl: path => {
    if (path.slice(-4) === ".git") return path;
    return path + ".git";
  }
};
exports.UrlHelper = UrlHelper;