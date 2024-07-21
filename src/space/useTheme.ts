import { useEffect, useMemo } from 'react';

import hosts from 'constants/hosts';
import { getHost } from 'parsers';
import { useWindows } from 'stores/useWindows';

export function useTheme() {
  const windows = useWindows();

  const theme = useMemo(() => {
    if (windows.stack.every((w) => getHost(w.url) === 'twitch' || getHost(w.url) === 'twitch-chat')) {
      return 'twitch';
    }
  }, [windows.stack]);

  useEffect(() => {
    if (theme) {
      document.body.classList.add(theme);
      return;
    }
    Object.keys(hosts).forEach((host) => document.body.classList.remove(host));
  }, [theme]);
}
