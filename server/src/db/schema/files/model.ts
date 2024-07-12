import { type File as FormidableFile } from 'formidable';
import { files } from './entity';
import { mediaTypes } from '@/utils/constants';

export type NewFile = typeof files.$inferInsert;
export type File = typeof files.$inferSelect;

export type MediaType = (typeof mediaTypes)[number];
export type MediaFile = FormidableFile;
