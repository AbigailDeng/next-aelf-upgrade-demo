import { GitHelper } from "../index";
// default master
export const get_source = async (branch: string) => {
  //   const sourcePath = "https://github.com/AbigailDeng/create-next-aelf.git";
  const sourcePath = "https://github.com/AElfProject/next-aelf.git";
  const cloneResponse = await GitHelper.CloneAndGetPath(sourcePath, branch);
  return cloneResponse;
};
