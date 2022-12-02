"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_source = void 0;
var _index = require("../index");
// default master
const get_source = async branch => {
  //   const sourcePath = "https://github.com/AbigailDeng/create-next-aelf.git";
  const sourcePath = "https://github.com/AElfProject/next-aelf.git";
  const cloneResponse = await _index.GitHelper.CloneAndGetPath(sourcePath, branch);
  return cloneResponse;
};
exports.get_source = get_source;