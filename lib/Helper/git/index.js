"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GitHelper = void 0;
var _util = require("util");
var _child_process = require("child_process");
var _temp = require("temp");
var _chalk = _interopRequireDefault(require("chalk"));
var _index = require("../index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GitHelper = {
  CloneAndGetPath: async (path, branch) => {
    try {
      console.log(`Start cloning repo${branch ? ` v${_chalk.default.green(branch)}` : ""} ...`);
      const tempInfo = await (0, _util.promisify)(_temp.mkdir)("");
      // Sparse checkout pattern
      await (0, _util.promisify)(_child_process.exec)(`git clone ${branch ? `--branch ${branch}` : ""} ${_index.UrlHelper.GetGitUrl(path)} "${tempInfo}"`);
      return tempInfo;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : e);
    }
  }
};
exports.GitHelper = GitHelper;