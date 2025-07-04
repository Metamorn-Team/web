import { v4 } from "uuid";

export function setDeviceId() {
  const cookieName = "sessionId";

  const existing = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));

  if (existing) return existing.split("=")[1];

  const newId = v4();
  const isDev =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  document.cookie = `${cookieName}=${newId}; path=/; domain=${
    isDev ? "" : ".livisland.com"
  } ${isDev ? "" : "; SameSite=None; Secure"}`;
  // document.cookie = `${cookieName}=${newId}; path=/`;
  return newId;
}
