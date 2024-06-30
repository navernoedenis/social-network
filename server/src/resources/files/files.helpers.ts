import { type MediaType, type MediaFile } from '@/db/files/models';
import { convertToBytes } from '@/utils/helpers';

export const checkMaxQuantity = (
  mediaType: MediaType,
  mediaFiles: MediaFile[]
) => {
  if (mediaType === 'audio' && mediaFiles.length > 3) {
    return 'Maximum 3 audio files';
  }

  if (mediaType === 'image' && mediaFiles.length > 5) {
    return 'Maximum 5 image files';
  }

  if (mediaType === 'video' && mediaFiles.length > 1) {
    return 'Maximum 1 video file';
  }
};

export const checkMimetimesEquality = (
  mediaType: MediaType,
  mediaFiles: MediaFile[]
) => {
  return mediaFiles.every((file) => {
    const fileType = file.mimetype!.split('/')[0];
    return fileType === mediaType;
  });
};

export const checkMaxSize = (mediaType: MediaType, mediaFiles: MediaFile[]) => {
  const maxSizes: Record<string, [number, string]> = {
    audio: [convertToBytes(15, 'mb'), 'Maximum size for audio is 15 megabytes'],
    image: [convertToBytes(8, 'mb'), 'Maximum size for image is 8 megabytes'],
    video: [convertToBytes(60, 'mb'), 'Maximum size for video is 60 megabytes'],
  };

  const [maxSize, error] = maxSizes[mediaType];
  const hasMoreSize = mediaFiles.some((file) => file.size >= maxSize);
  return hasMoreSize ? error : null;
};
