import { type Request, type Response, type NextFunction } from '@/types/main';
import { BadRequest, NotFound } from '@/utils/helpers';
import { friendsService } from './friends.service';

export const checkFriend = (
  config: {
    notFoundError?: boolean;
    skipApproved?: boolean;
    skipPending?: boolean;
  } = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    const userId = parseInt(req.params.id);

    const {
      notFoundError = false,
      skipApproved = false,
      skipPending = false,
    } = config;

    try {
      const friendship = await friendsService.getOne(userId, user.id);
      if (notFoundError && !friendship) {
        throw new NotFound('Friendship has not been founded 🥛');
      }

      const isPending = friendship?.status === 'pending';
      const isApproved = friendship?.status === 'approved';

      if (!skipPending && isPending) {
        throw new BadRequest(
          'You or your friend already created friendship request 🦏'
        );
      }

      if (!skipApproved && isApproved) {
        throw new BadRequest('You are already friends 🧀');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
