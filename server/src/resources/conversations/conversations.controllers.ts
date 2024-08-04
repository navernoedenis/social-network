import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { httpStatus } from '@/utils/constants';

import { conversationsService } from './conversations.service';
import { type CreateConversationDto } from './conversations.types';

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as CreateConversationDto;

  try {
    const conversation = await conversationsService.createOne(
      me.id,
      dto.userId
    );

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: conversation,
      message: 'You have created a conversation 🦴',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;

  try {
    const conversations = await conversationsService.getMany(me.id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: conversations,
      message: 'Here is your conversation list 🚏',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);

  try {
    await conversationsService.deleteOne(id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: true,
      message: 'You have removed a conversation 🔨',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
