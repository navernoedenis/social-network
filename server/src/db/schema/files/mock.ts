import { faker } from '@faker-js/faker';
import { mediaTypes } from '@/utils/constants';
import { type MediaType } from '@/types/main';
import { type NewFile } from './model';

export const createFile = (
  authorId: number,
  mediaType?: MediaType
): NewFile => {
  const type = mediaType ?? faker.helpers.arrayElement(mediaTypes);
  let url = '';

  switch (type) {
    case 'audio': {
      url =
        'https://social-network-files.s3.amazonaws.com' +
        '/random/erika-i-dont-know.mp3';
      break;
    }
    case 'image': {
      url = faker.image.url();
      break;
    }
    case 'video': {
      url =
        'https://social-network-files.s3.amazonaws.com' +
        '/random/night-of-the-demons-1988-trailer.mp4';
      break;
    }
  }

  const isbn = faker.commerce.isbn();

  return {
    authorId,
    bucketKey: `bucket/${isbn}`,
    name: isbn,
    type,
    url,
  };
};
