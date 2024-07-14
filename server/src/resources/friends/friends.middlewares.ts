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
    const me = req.user!;
    const userId = parseInt(req.params.id);

    const {
      notFoundError = false,
      skipApproved = false,
      skipPending = false,
    } = config;

    try {
      const friend = await friendsService.getOne(userId, me.id);
      if (notFoundError && !friend) {
        throw new NotFound('Friend has not been founded 🥛');
      }

      const isPending = friend?.status === 'pending';
      const isApproved = friend?.status === 'approved';

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
