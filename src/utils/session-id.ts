import { v4 } from "uuid";

export function setSessionId() {
  const cookieName = "sessionId";

  const existing = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));

  if (existing) return existing.split("=")[1];

  const newId = v4();
  const isDev =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  // 1년 (365일 * 24시간 * 60분 * 60초)
  const maxAge = 365 * 24 * 60 * 60;

  document.cookie = `${cookieName}=${newId}; path=/; max-age=${maxAge}; domain=${
    isDev ? "" : ".livisland.com"
  } ${isDev ? "" : "; SameSite=None; Secure"}`;
  return newId;
}
