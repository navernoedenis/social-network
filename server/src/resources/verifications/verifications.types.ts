export type CreateVerificationConfig = {
  userId: number;
  payload: string;
  expiredAt?: Date;
};

export type GetVerificationConfig = {
  userId: number;
  skipExpireCheking?: boolean;
};
