export const paginateQuery = (
  query: { page?: string; limit?: string },
  options: { defaultLimit: number }
) => {
  const { page, limit } = query;

  return {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : options.defaultLimit,
  };
};
