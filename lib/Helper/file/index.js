"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileHelper = void 0;
var _fs = require("fs");
var _path = require("path");
const FileHelper = {
  removeDir: path => {
    try {
      // judge is dir or file
      const statObj = (0, _fs.statSync)(path);
      if (statObj.isDirectory()) {
        let dirs = (0, _fs.readdirSync)(path);
        // complete path
        dirs = dirs.map(dir => (0, _path.join)(path, dir));
        for (let i = 0; i < dirs.length; i++) {
          // delete child and then delete itself
          FileHelper.removeDir(dirs[i]);
        }
        // only can be used when dir is empty
        (0, _fs.rmdirSync)(path);
      } else {
        (0, _fs.unlinkSync)(path);
      }
      return true;
    } catch (e) {
      return false;
    }
  }
};
exports.FileHelper = FileHelper;