import "server-only";

import { cookies } from "next/headers";
import { Theme } from "@/app/account/themes/enum";

export const getPreferredTheme = () => {
  const preferredThemeCookies = Theme.Auto as Theme;

  if (!Object.values(Theme).includes(preferredThemeCookies)) {
    return Theme.Auto;
  }

  return preferredThemeCookies;
};

export default function getTheme() {
  const themeCookies = Theme.Light as Theme;

  if (themeCookies !== Theme.Light && themeCookies !== Theme.Dark) {
    return Theme.Light;
  }

  return themeCookies;
}
