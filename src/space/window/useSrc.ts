const hosts = {
  twitch: ['twitch.tv', 'www.twitch.tv'],
};

const players: Record<keyof typeof hosts, (videoId: string) => string> = {
  twitch: (videoId) => {
    const url = new URL("https://player.twitch.tv/?parent=localhost");
    url.searchParams.set('channel', videoId);
    return url.toString();
  },
};

type Props = {
  url: string;
}

export function useSrc(props: Props) {
  const { url } = props;

  const src = (() => {
    if (url === "") return null;
    try {
      const urlObj = new URL(url);

      const host = Object.entries(hosts).find(([, hosts]) => hosts.includes(urlObj.host))?.[0] as keyof typeof hosts | undefined;

      if (host === 'twitch') {
        const videoId = urlObj.pathname.split('/').pop();
        if (videoId) {
          return players['twitch'](videoId);
        }
      }

      return null;
    } catch { return null; }
  })();

  return src;
}