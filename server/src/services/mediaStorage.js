import { v2 as cloudinary } from 'cloudinary';

const isConfigured = () => Boolean(process.env.CLOUDINARY_URL);
const MANAGED_FOLDER_PREFIX = 'webstore/';
const allowedResourceTypes = new Set(['image', 'video']);

const mediaInputError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const mediaConfigurationError = () => {
  const error = new Error('Media uploads are not configured. Set CLOUDINARY_URL or use an image URL.');
  error.statusCode = 503;
  return error;
};

export const normalizeExternalMediaUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw mediaInputError('Media URL must be a non-empty HTTPS URL');
  }

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') {
      throw mediaInputError('Media URL must use HTTPS');
    }
    return url.toString();
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw mediaInputError('Media URL must be a valid HTTPS URL');
  }
};

export const uploadMedia = (file, folder) => {
  if (!file) {
    return Promise.resolve(null);
  }

  // Review uploads arrive from the streaming Multer storage engine below.
  // Their server-produced Cloudinary metadata can be reused without ever
  // materializing the file in application memory a second time.
  if (
    typeof file.secureUrl === 'string' &&
    typeof file.publicId === 'string' &&
    file.publicId.startsWith(`${folder}/`) &&
    allowedResourceTypes.has(file.resourceType)
  ) {
    return Promise.resolve({
      secureUrl: file.secureUrl,
      publicId: file.publicId,
      resourceType: file.resourceType
    });
  }

  if (!isConfigured()) {
    throw mediaConfigurationError();
  }

  const resourceType = file.mimetype?.startsWith('video/') ? 'video' : 'image';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType
        });
      }
    );

    stream.end(file.buffer);
  });
};

export const createReviewMediaStorage = () => ({
  _handleFile(req, file, callback) {
    if (!isConfigured()) {
      callback(mediaConfigurationError());
      return;
    }

    const resourceType = file.fieldname === 'video' ? 'video' : 'image';
    let settled = false;
    const finish = (error, info) => {
      if (settled) {
        return;
      }
      settled = true;
      callback(error, info);
    };

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'webstore/reviews',
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          finish(error);
          return;
        }
        finish(null, {
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType
        });
      }
    );

    file.stream.once('error', finish);
    stream.once('error', finish);
    file.stream.pipe(stream);
  },

  _removeFile(req, file, callback) {
    deleteMedia({
      publicId: file.publicId,
      resourceType: file.resourceType
    }).then(
      () => callback(null),
      callback
    );
  }
});

export const deleteMedia = async (asset) => {
  const publicId = asset?.publicId;
  const resourceType = asset?.resourceType;

  // Never derive destructive Cloudinary credentials from a user-stored URL.
  // Legacy URL-only records are intentionally left untouched rather than guessed.
  if (
    typeof publicId !== 'string' ||
    !publicId.startsWith(MANAGED_FOLDER_PREFIX) ||
    !allowedResourceTypes.has(resourceType) ||
    !isConfigured()
  ) {
    return false;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  });

  return true;
};
