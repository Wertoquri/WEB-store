import multer from 'multer';
import path from 'path';
import { createReviewMediaStorage } from '../services/mediaStorage.js';

const REVIEW_MEDIA_MAX_FILE_SIZE = 5 * 1024 * 1024;
const REVIEW_MEDIA_FIELDS = [
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
];

const imageExtensions = new Set(['jpeg', 'jpg', 'png', 'gif', 'webp']);
const videoExtensions = new Set(['mp4', 'webm']);
const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const videoMimeTypes = new Set(['video/mp4', 'video/webm']);

const reviewMediaFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (
    file.fieldname === 'images' &&
    imageExtensions.has(ext) &&
    imageMimeTypes.has(file.mimetype?.toLowerCase())
  ) {
    cb(null, true);
    return;
  }

  if (
    file.fieldname === 'video' &&
    videoExtensions.has(ext) &&
    videoMimeTypes.has(file.mimetype?.toLowerCase())
  ) {
    cb(null, true);
    return;
  }

  cb(new Error('UNSUPPORTED_REVIEW_MEDIA_TYPE'));
};

export const reviewMediaUpload = multer({
  storage: createReviewMediaStorage(),
  fileFilter: reviewMediaFilter,
  limits: {
    fileSize: REVIEW_MEDIA_MAX_FILE_SIZE,
    files: 6,
    fields: 5,
    parts: 11,
    fieldNameSize: 32,
    fieldSize: 8 * 1024
  }
}).fields(REVIEW_MEDIA_FIELDS);

export { REVIEW_MEDIA_MAX_FILE_SIZE };
