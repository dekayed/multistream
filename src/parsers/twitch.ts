import hosts from 'constants/hosts';

export default function (url: string) {
  const matches = url.matchAll(hosts['twitch']);

  const channel = Array.from(matches)[0][5]!;

  const playerUrl = new URL(`https://player.twitch.tv/?parent=${window.location.hostname}`);
  playerUrl.searchParams.set('channel', channel);

  return playerUrl.toString();
}

export function getChatUrl(url: string) {
  const matches = url.matchAll(hosts['twitch']);

  const channel = Array.from(matches)[0][5]!;

  const chatUrl = new URL(`https://www.twitch.tv/embed/${channel}/chat`);

  return chatUrl.toString();
}