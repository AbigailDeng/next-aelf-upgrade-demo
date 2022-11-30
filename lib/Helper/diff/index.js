"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiffHelper = void 0;
const DiffHelper = {
  diffObjWithKeys: (curr, prev, keys) => {
    const res = [];
    keys.forEach(ele => {
      if (prev[ele] !== curr[ele] && curr[ele]) {
        res.push({
          [ele]: curr[ele]
        });
      }
    });
    return res;
  }
};
exports.DiffHelper = DiffHelper;