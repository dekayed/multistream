import { useState } from "react";

export class Media {
  id: string;
  url: string;

  constructor(url: string) {
    this.id = crypto.randomUUID();
    this.url = url;
  }
}

const emptySet = new Set<Media>();

export function useMediaStore() {
  const [mediaList, setMediaList] = useState<Set<Media>>(emptySet);

  const addNewMedia = () => setMediaList((mediaList) => new Set(mediaList.add(new Media(""))));

  const findMedia = (id: Media['id']) => {
    const media = Array.from(mediaList.values()).find((media) => media.id === id);
    return media;
  };

  const removeMedia = (id: Media['id']) => {
    const media = findMedia(id);
    if (!media) return;

    setMediaList((mediaList) => {
      mediaList.delete(media);
      return new Set(mediaList);
    });
  };

  const updateMedia = (id: string, newUrl: string) => {
    const media = findMedia(id);
    if (!media) return;

    media.url = newUrl;
    setMediaList((mediaList) => new Set(mediaList));
  };

  return {
    mediaList,
    addNewMedia,
    removeMedia,
    updateMedia,
  };
}