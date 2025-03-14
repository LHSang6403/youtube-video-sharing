export const CACHE_KEYS = {
  VIDEO_LIST: 'videos-cache',
  USER_LIST: 'users-cache',
  USER_BY_ID: (id: number) => `user-${id}`,
};
