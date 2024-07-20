import { getHost, parsers } from 'parsers';

type Props = {
  url: string;
}

export function useSrc(props: Props) {
  const { url } = props;

  const host = getHost(url);

  const src = (() => {
    if (url === "") return null;
    try {
      if (host && parsers[host]) {
        return parsers[host](url);
      }

      return null;
    } catch { return null; }
  })();

  return { src, host };
}