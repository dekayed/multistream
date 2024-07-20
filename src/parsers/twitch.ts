export default function (url: string) {
  const urlObj = new URL(url);

  const videoId = urlObj.pathname.split('/').pop()!;

  const playerUrl = new URL(`https://player.twitch.tv/?parent=${window.location.hostname}`);
  playerUrl.searchParams.set('channel', videoId);

  return playerUrl.toString();
}