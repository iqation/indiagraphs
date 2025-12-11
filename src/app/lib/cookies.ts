import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}
