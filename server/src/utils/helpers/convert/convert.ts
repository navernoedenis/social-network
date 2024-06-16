import { BYTES_IN } from '@/utils/constants';

export const convertToBytes = (value: number, key: keyof typeof BYTES_IN) => {
  return BYTES_IN[key] * value;
};
