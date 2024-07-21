export default function (url: string) {
  const urlObj = new URL(url);

  const z = urlObj.searchParams.get('z')!;
  const video = z.replace('video', '');
  const oid = video.split('_')[0];
  const id = video.split('_')[1];

  const playerUrl = new URL('https://vk.com/video_ext.php');
  playerUrl.searchParams.set('oid', oid);
  playerUrl.searchParams.set('id', id);

  return playerUrl.toString();
}