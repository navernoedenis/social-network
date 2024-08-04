import { type Request, type Response, type NextFunction } from '@/types/main';
import { Forbidden, NotFound } from '@/utils/helpers';

import { conversationsService } from './conversations.service';
import { type CreateConversationDto } from './conversations.types';

export const checkCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as CreateConversationDto;

  try {
    if (me.id === dto.userId) {
      throw new Forbidden("You can't create a converastion with yourself 🌨️");
    }

    const conversation = await conversationsService.getOne(me.id, dto.userId);
    if (conversation) {
      throw new NotFound('Conversation is already exists 🫠');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkDeleting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const userId = parseInt(req.params.id);

  try {
    const conversation = await conversationsService.getOne(me.id, userId);
    if (!conversation) {
      throw new NotFound('Conversation does not exist 💎');
    }

    const hasPermission = [conversation.authorId, conversation.userId].includes(
      me.id
    );
    if (hasPermission) {
      return next();
    }

    throw new Forbidden("You are trying to remove not your's conversation ☠️");
  } catch (error) {
    next(error);
  }
};
