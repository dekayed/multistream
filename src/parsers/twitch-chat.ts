export default function (url: string) {
  const playerUrl = new URL(url);
  playerUrl.searchParams.set('parent', window.location.hostname);
  playerUrl.searchParams.set('darkpopout', 'true');

  return playerUrl.toString();
}