const cloudinary = require('cloudinary').v2;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'trzartkt';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '557642941456319';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '9X-1vm164TOVt0HnEQ1At4N6st4';

// Configure Cloudinary SDK instance
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Ping Cloudinary API to verify account credentials and connectivity
 */
const pingCloudinary = async () => {
  try {
    const res = await cloudinary.api.ping();
    return { success: true, status: res.status };
  } catch (err) {
    console.error('[Cloudinary Service] Ping error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Upload an image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {Object} options - Custom Cloudinary upload options (folder, tags, transformation)
 * @returns {Promise<Object>} Upload result with secure_url, public_id, format, etc.
 */
const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'luxury_fashion/products',
      resource_type: 'image',
      overwrite: options.overwrite !== undefined ? options.overwrite : true,
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('[Cloudinary Service] Upload error:', error.message);
        return reject(error);
      }
      resolve({
        success: true,
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at,
      });
    });

    stream.end(buffer);
  });
};

/**
 * Upload a Base64 string or remote image URL to Cloudinary
 * @param {string} source - Base64 data URI or remote HTTP/HTTPS URL
 * @param {Object} options - Custom upload options
 */
const uploadSource = async (source, options = {}) => {
  const uploadOptions = {
    folder: options.folder || 'luxury_fashion/products',
    resource_type: 'image',
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  };

  const result = await cloudinary.uploader.upload(source, uploadOptions);
  return {
    success: true,
    public_id: result.public_id,
    secure_url: result.secure_url,
    url: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    created_at: result.created_at,
  };
};

/**
 * Delete an image from Cloudinary by its public_id
 * @param {string} publicId - Cloudinary public ID
 */
const deleteImage = async (publicId) => {
  if (!publicId || typeof publicId !== 'string') {
    return { success: false, reason: 'invalid_public_id' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (err) {
    console.error(`[Cloudinary Service] Delete error for ${publicId}:`, err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};

/**
 * Extract Cloudinary public_id from a Cloudinary secure_url if public_id wasn't stored separately
 * @param {string} url - Cloudinary image URL
 */
const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    // Strip version prefix if present (e.g. v1788176849/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Strip extension
    const publicIdWithExt = withoutVersion.substring(0, withoutVersion.lastIndexOf('.')) || withoutVersion;
    return publicIdWithExt;
  } catch (e) {
    return null;
  }
};

module.exports = {
  cloudinary,
  pingCloudinary,
  uploadBuffer,
  uploadSource,
  deleteImage,
  extractPublicIdFromUrl,
};
