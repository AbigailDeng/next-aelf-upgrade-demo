import { IdependenciesItem } from "../../../@types";

export const DiffHelper = {
  diffObjWithKeys: (
    curr: IdependenciesItem,
    prev: IdependenciesItem,
    keys: string[]
  ): IdependenciesItem[] => {
    const res: IdependenciesItem[] = [];
    keys.forEach((ele) => {
      if (DiffHelper.isUpgradePkg(curr, prev, ele)) {
        res.push({
          [ele]: curr[ele],
        });
      }
    });
    return res;
  },
  getPrefixAndVer: (
    obj: IdependenciesItem,
    key: string
  ): {
    prefix: string;
    version: string;
  } => {
    const res = {
      prefix: "",
      version: "",
    };
    if (obj[key].startsWith("~")) {
      res.prefix = "~";
      res.version = obj[key].slice(1);
    } else if (obj[key].startsWith("^")) {
      res.prefix = "^";
      res.version = obj[key].slice(1);
    } else if (obj[key].startsWith("<")) {
      res.prefix = "<";
      res.version = obj[key].slice(1);
    } else if (obj[key].startsWith("<=")) {
      res.prefix = "<=";
      res.version = obj[key].slice(2);
    } else if (obj[key].startsWith(">")) {
      res.prefix = ">";
      res.version = obj[key].slice(1);
    } else if (obj[key].startsWith(">=")) {
      res.prefix = ">=";
      res.version = obj[key].slice(2);
    } else if (obj[key].startsWith("git+")) {
      res.prefix = "git+";
      res.version = obj[key];
    } else {
      res.version = obj[key];
    }
    return res;
  },
  //
  zeroPadding: (arr: string[]) => {
    let len = arr.length;
    let res = [...arr];
    if (len === 1) {
      res.push("0", "0");
    } else if (len === 2) {
      res.push("0");
    }
    // deal with x and *
    for (let i = 0; i < res.length; i++) {
      if (res[i] === "x" || res[i] === "*") {
        res[i] = "0";
      }
    }
    return res;
  },
  // prefix ~
  dealTilde: (verCurr: string, verPrev: string) => {
    const verCurrArr = DiffHelper.zeroPadding(verCurr.split(".")),
      verPrevArr = DiffHelper.zeroPadding(verPrev.split("."));
    if (
      verPrevArr[0] === verCurrArr[0] &&
      verPrevArr[1] === verCurrArr[1] &&
      verPrevArr[2] >= verCurrArr[2]
    ) {
      return false;
    } else {
      return true;
    }
  },
  // prefix ^
  dealCaret: (verCurr: string, verPrev: string) => {
    const verCurrArr = DiffHelper.zeroPadding(verCurr.split(".")),
      verPrevArr = DiffHelper.zeroPadding(verPrev.split("."));
    if (
      verPrevArr[0] === verCurrArr[0] &&
      (verPrevArr[1] > verCurrArr[1] ||
        (verPrevArr[1] === verCurrArr[1] && verPrevArr[2] >= verCurrArr[2]))
    ) {
      return false;
    } else {
      return true;
    }
  },
  compareNum: (verCurr: string, verPrev: string) => {
    const verCurrStr = verCurr.split(".").join("").padEnd(10, "0"),
      verPrevStr = verPrev.split(".").join("").padEnd(10, "0");
    const diff = +verCurrStr - +verPrevStr;
    if (diff > 0) {
      return 1;
    } else if (diff === 0) {
      return 0;
    } else {
      return -1;
    }
  },
  isUpgradePkg: (
    curr: IdependenciesItem,
    prev: IdependenciesItem,
    key: string
  ): boolean => {
    // remote not include or empty string or *
    if (!curr[key] || curr[key] === "*") {
      return false;
    }
    if (!prev[key]) {
      return true;
    }
    const { prefix: prefixCurr, version: verCurr } = DiffHelper.getPrefixAndVer(
      curr,
      key
    );
    const { prefix: prefixPrev, version: verPrev } = DiffHelper.getPrefixAndVer(
      prev,
      key
    );
    // remote prefix
    if (prefixCurr !== prefixPrev) {
      if (prefixCurr === "~" && !prefixPrev) {
        // remote prefix: ~
        // local prefix: empty
        return DiffHelper.dealTilde(verCurr, verPrev);
      } else if (prefixCurr === "^" && (prefixPrev === "~" || !prefixPrev)) {
        // remote prefix: ^
        // local prefix: ~ or empty
        return DiffHelper.dealCaret(verCurr, verPrev);
      } else {
        return true;
      }
    } else {
      switch (prefixCurr) {
        // case "<":
        //   return DiffHelper.compareNum(verCurr, verPrev) === -1;
        // case "<=":
        //   return (
        //     DiffHelper.compareNum(verCurr, verPrev) === -1 ||
        //     DiffHelper.compareNum(verCurr, verPrev) === 0
        //   );
        // case ">":
        //   return DiffHelper.compareNum(verCurr, verPrev) === 1;
        // case ">=":
        //   return (
        //     DiffHelper.compareNum(verCurr, verPrev) === 1 ||
        //     DiffHelper.compareNum(verCurr, verPrev) === 0
        //   );
        case "~":
          return DiffHelper.dealTilde(verCurr, verPrev);
        case "^":
          return DiffHelper.dealCaret(verCurr, verPrev);
        default:
          return !(verCurr === verPrev);
      }
    }
  },
};
