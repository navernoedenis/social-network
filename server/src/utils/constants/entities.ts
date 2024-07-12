export const bookmarkTypes = ['post'] as const;
export const friendStatuses = ['pending', 'approved'] as const;
export const mediaTypes = ['audio', 'image', 'video'] as const;
export const notificationTypes = ['friend-request', 'birthday'] as const;
export const roles = ['user', 'admin', 'root'] as const;
export const verificationTypes = [
  '2fa',
  'email',
  'forgot-password',
  'phone',
] as const;
