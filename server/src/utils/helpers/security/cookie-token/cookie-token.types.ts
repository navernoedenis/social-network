export type CookieToken = {
  token: string;
  expiredAt?: Date;
};

export type CookieTokenOptions = {
  rememberMe?: boolean;
};

export type ParseCookieToken =
  | { hasToken: false; isExpired?: never; refreshToken?: never }
  | { hasToken: true; isExpired: boolean; refreshToken: string };
