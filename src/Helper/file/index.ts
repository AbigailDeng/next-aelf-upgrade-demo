import { statSync, readdirSync, rmdirSync, unlinkSync } from "fs";
import { join } from "path";
export const FileHelper = {
  removeDir: (path: string) => {
    try {
      // judge is dir or file
      const statObj = statSync(path);
      if (statObj.isDirectory()) {
        let dirs = readdirSync(path);
        // complete path
        dirs = dirs.map((dir) => join(path, dir));
        for (let i = 0; i < dirs.length; i++) {
          // delete child and then delete itself
          FileHelper.removeDir(dirs[i]);
        }
        // only can be used when dir is empty
        rmdirSync(path);
      } else {
        unlinkSync(path);
      }
      return true;
    } catch (e) {
      return false;
    }
  },
};
