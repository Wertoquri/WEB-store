import { v2 as cloudinary } from 'cloudinary';

const isConfigured = () => Boolean(process.env.CLOUDINARY_URL);

export const uploadMedia = (file, folder) => {
  if (!file) {
    return Promise.resolve(null);
  }

  if (!isConfigured()) {
    const error = new Error('Media uploads are not configured. Set CLOUDINARY_URL or use an image URL.');
    error.statusCode = 503;
    throw error;
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
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};

const parseCloudinaryAsset = (assetUrl) => {
  if (!assetUrl || !assetUrl.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const { pathname } = new URL(assetUrl);
    const match = pathname.match(/\/(image|video)\/upload\/(?:v\d+\/)?(.+)\.[^/.]+$/);
    return match ? { resourceType: match[1], publicId: match[2] } : null;
  } catch {
    return null;
  }
};

export const deleteMedia = async (assetUrl) => {
  const asset = parseCloudinaryAsset(assetUrl);
  if (!asset || !isConfigured()) {
    return;
  }

  await cloudinary.uploader.destroy(asset.publicId, {
    resource_type: asset.resourceType,
    invalidate: true
  });
};
