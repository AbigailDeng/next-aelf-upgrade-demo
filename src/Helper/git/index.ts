import { promisify } from "util";
import { exec } from "child_process";
import { mkdir } from "temp";
import chalk from "chalk";
import { UrlHelper } from "../index";

export const GitHelper = {
  CloneAndGetPath: async (path: string, branch: string): Promise<string> => {
    try {
      console.log(
        `Start cloning repo${branch ? ` v${chalk.green(branch)}` : ""} ...`
      );
      const tempInfo = (await promisify(mkdir)("")) as string;
      // Sparse checkout pattern
      await promisify(exec)(
        `git clone ${branch ? `--branch ${branch}` : ""} ${UrlHelper.GetGitUrl(
          path
        )} "${tempInfo}"`
      );
      return tempInfo;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : (e as string));
    }
  },
};
