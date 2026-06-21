import multer from 'multer';
import path from 'path';

const REVIEW_VIDEO_MAX_SIZE = 20 * 1024 * 1024;
const REVIEW_MEDIA_FIELDS = [
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
];

const imageExtensions = new Set(['jpeg', 'jpg', 'png', 'gif', 'webp']);
const videoExtensions = new Set(['mp4', 'webm']);

const reviewMediaFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (file.fieldname === 'images' && imageExtensions.has(ext)) {
    cb(null, true);
    return;
  }

  if (file.fieldname === 'video' && videoExtensions.has(ext)) {
    cb(null, true);
    return;
  }

  cb(new Error('UNSUPPORTED_REVIEW_MEDIA_TYPE'));
};

export const reviewMediaUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: reviewMediaFilter,
  limits: {
    fileSize: REVIEW_VIDEO_MAX_SIZE,
    files: 6
  }
}).fields(REVIEW_MEDIA_FIELDS);

export { REVIEW_VIDEO_MAX_SIZE };
