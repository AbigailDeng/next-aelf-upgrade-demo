import { BinaryHelper } from "../binary";

export const get_potential_package_managers = (): Array<{
  title: string;
  value: string;
}> => {
  const pmQuestionChoises = [
    {
      title: "Npm",
      value: "npm",
    },
  ];
  const canUseYarn = BinaryHelper.canUseYarn();
  const canUsePnpm = BinaryHelper.canUsePnpm();
  if (canUseYarn) {
    pmQuestionChoises.push({
      title: "Yarn",
      value: "yarn",
    });
  }

  if (canUsePnpm) {
    pmQuestionChoises.push({
      title: "pnpm"
        .split("")
        .map((v) =>
          Math.round(Math.random()) ? v.toUpperCase() : v.toLowerCase()
        )
        .join(""),
      value: "pnpm",
    });
  }

  return pmQuestionChoises;
};
