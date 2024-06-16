import formidable from 'formidable';
import {
  type HttpResponse,
  type MediaType,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { httpStatus, mediaTypes } from '@/utils/constants';
import { BadRequest } from '@/utils/helpers';
import { awsS3Service } from '@/utils/services';

import {
  checkMaxQuantity,
  checkMaxSize,
  checkMimetimesEquality,
} from './files.helpers';

import { fileService } from './files.service';
import { type DeleteFilesDto } from './files.types';

export const uploadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const mediaType = (fields['type'] ?? [])[0] as MediaType;
    if (!mediaType || !mediaTypes.includes(mediaType)) {
      throw new BadRequest('Check your media type before sending...');
    }

    const mediaFiles = files['files'] ?? [];
    if (!mediaFiles.length) {
      throw new BadRequest('You have no files');
    }

    const maxQuantityError = checkMaxQuantity(mediaType, mediaFiles);
    if (maxQuantityError) {
      throw new BadRequest(maxQuantityError);
    }

    const isMimetimesEqual = checkMimetimesEquality(mediaType, mediaFiles);
    if (!isMimetimesEqual) {
      throw new BadRequest('Every file must contain the same mimetime');
    }

    const maxSizeError = checkMaxSize(mediaType, mediaFiles);
    if (maxSizeError) {
      throw new BadRequest(maxSizeError);
    }

    const newFiles = await awsS3Service.uploadFiles(mediaFiles);
    const newFilesData = newFiles.map((file) => ({
      authorId: user.id,
      bucketKey: file.bucketKey,
      name: file.filename,
      type: mediaType,
      url: file.url,
    }));

    const uploadedFiles = await fileService.createFiles(newFilesData);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: uploadedFiles,
      message: 'Files has been uploaded 🐪',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const deleteFilesDto = req.body as DeleteFilesDto;

  try {
    const files = await fileService.getFiles(user.id, deleteFilesDto.fileIds);
    if (!files.length) {
      throw new BadRequest('Invalid ids or no files to remove 🫷');
    }

    const bucketKeys: string[] = [];
    const filesIds: string[] = [];

    for (const file of files) {
      bucketKeys.push(file.bucketKey);
      filesIds.push(file.id);
    }

    await Promise.all([
      awsS3Service.deleteFiles(bucketKeys),
      fileService.deleteFiles(user.id, filesIds),
    ]);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'File or files has been removed 🙋',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
