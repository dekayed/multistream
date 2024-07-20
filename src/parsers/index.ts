import hosts from 'constants/hosts';

import twitch from './twitch';
import twitchChat from './twitch-chat';
// import vk from './vk';

export const parsers = {
  twitch,
  ['twitch-chat']: twitchChat,
  // vk
};

export const getHost = (url: string) => {
  try {
    const result = Object.entries(hosts)
      .find(([, regex]) =>
        Array.from(url.matchAll(regex))[0]?.some((part) => part === url)
      )?.[0] as keyof typeof hosts | undefined;

    console.log(url, hosts, result);

    return result;
  } catch { return; }
};