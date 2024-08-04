export type FriendsParams = {
  userId: number;
  page: number;
  limit: number;
};

export type RequestStatus = 'incoming' | 'outgoing';
