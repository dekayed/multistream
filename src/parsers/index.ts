import hosts from "constants/hosts.json";

import twitch from "./twitch";

export const parsers = {
  twitch
};

export const getHost = (url: string) => {
  try {
    const urlObj = new URL(url);

    return Object.entries(hosts).find(([, hosts]) => hosts.includes(urlObj.host))?.[0] as keyof typeof hosts | undefined;
  } catch { return; }
};