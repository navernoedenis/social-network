import { capitalize, getDate } from '@/utils/helpers';

export const createBirthdayMessage = (data: {
  date: Date;
  birthPersonFirstname: string;
  birthPersonLastname: string;
}) => {
  const { day, monthShort } = getDate(data.date);

  const firstname = capitalize(data.birthPersonFirstname);
  const lastname = capitalize(data.birthPersonLastname);

  return `Wish <b>${firstname} ${lastname}</b> a happy birthday (${monthShort} ${day})`;
};

export const createFriendRequestMessage = (data: {
  senderFirstname: string;
  senderLastname: string;
}) => {
  const firstname = capitalize(data.senderFirstname);
  const lastname = capitalize(data.senderLastname);

  return `<b>${firstname} ${lastname}</b> sent you a friend request.`;
};
