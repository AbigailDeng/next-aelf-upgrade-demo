"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiffHelper = void 0;
const DiffHelper = {
  diffObjWithKeys: (curr, prev, keys) => {
    const res = [];
    keys.forEach(ele => {
      if (DiffHelper.isUpgradePkg(curr, prev, ele)) {
        res.push({
          [ele]: curr[ele]
        });
      }
    });
    return res;
  },
  getPrefixAndVer: (obj, key) => {
    const res = {
      prefix: "",
      version: ""
    };
    console.log(obj, key);
    if (obj[key].startsWith("~")) {
      res.prefix = "~";
      res.version = obj[key].slice(1);
    } else if (obj[key].startsWith("^")) {
      res.prefix = "^";
      res.version = obj[key].slice(1);
    } else if (obj[key].startsWith("git+")) {
      res.prefix = "git+";
      res.version = obj[key];
    } else {
      res.version = obj[key];
    }
    return res;
  },
  // prefix ~
  dealTilde: (verCurr, verPrev) => {
    const verCurrArr = verCurr.split("."),
      verPrevArr = verPrev.split(".");
    if (verPrevArr[0] === verCurrArr[0] && verPrevArr[1] === verCurrArr[1] && verPrevArr[2] >= verCurrArr[2]) {
      return false;
    } else {
      return true;
    }
  },
  // prefix ^
  dealCaret: (verCurr, verPrev) => {
    const verCurrArr = verCurr.split("."),
      verPrevArr = verPrev.split(".");
    if (verPrevArr[0] === verCurrArr[0] && verPrevArr[1] >= verCurrArr[1]) {
      return false;
    } else {
      return true;
    }
  },
  isUpgradePkg: (curr, prev, key) => {
    // remote not include
    if (!curr[key]) {
      return false;
    }
    if (!prev[key]) {
      return true;
    }
    const {
      prefix: prefixCurr,
      version: verCurr
    } = DiffHelper.getPrefixAndVer(curr, key);
    const {
      prefix: prefixPrev,
      version: verPrev
    } = DiffHelper.getPrefixAndVer(prev, key);
    if (prefixCurr !== prefixPrev) {
      return true;
    } else {
      switch (prefixCurr) {
        case "~":
          return DiffHelper.dealTilde(verCurr, verPrev);
        case "^":
          return DiffHelper.dealCaret(verCurr, verPrev);
        default:
          // no prefix or git+
          return !(verCurr === verPrev);
      }
    }
  }
};
exports.DiffHelper = DiffHelper;