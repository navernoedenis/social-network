export const calcLikes = (
  data: { userId: number; like: { value: number } }[],
  userId: number
) => {
  let likes = 0;
  let dislikes = 0;
  let isLiked = false;
  let isDisliked = false;

  for (const item of data) {
    const isLike = item.like.value === 1;
    const isDislike = item.like.value === -1;
    const isMyLike = item.userId === userId;

    if (isLike) {
      likes += 1;
      isMyLike && (isLiked = true);
    }

    if (isDislike) {
      dislikes += 1;
      isMyLike && (isDisliked = true);
    }
  }

  return {
    likes,
    dislikes,
    isLiked,
    isDisliked,
  };
};
