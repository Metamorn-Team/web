import { v4 } from "uuid";

export function setDeviceId() {
  const cookieName = "sessionId";

  const existing = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));

  if (existing) return existing.split("=")[1];

  const newId = v4();
  document.cookie = `${cookieName}=${newId}; path=/`;
  return newId;
}
