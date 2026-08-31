const multer = require('multer');
const cloudinaryService = require('../../services/cloudinaryService');

// Configure Multer for In-Memory Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image files (JPG, PNG, WEBP, GIF, AVIF, SVG) are allowed.'), false);
  }
};

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum file size
  },
  fileFilter,
});

/**
 * @desc    Upload single image to Cloudinary (Multipart File, Base64, or URL)
 * @route   POST /api/admin/upload
 * @access  Private (Admin / Manager)
 */
const uploadSingleImage = async (req, res, next) => {
  try {
    const folder = req.body?.folder || 'luxury_fashion/products';

    // Case 1: Upload via Multipart Form File (Multer)
    if (req.file && req.file.buffer) {
      const uploadResult = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder,
        filename_override: req.file.originalname,
      });

      return res.status(200).json({
        success: true,
        message: 'Image successfully uploaded to Cloudinary',
        data: uploadResult,
        // Flat aliases for frontend convenience
        secure_url: uploadResult.secure_url,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    // Case 2: Upload via Base64 Data URI or Image URL
    const { image, url, base64 } = req.body;
    const source = image || base64 || url;

    if (!source || typeof source !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file (multipart), base64 string, or image URL',
      });
    }

    const uploadResult = await cloudinaryService.uploadSource(source, { folder });

    res.status(200).json({
      success: true,
      message: 'Image successfully uploaded to Cloudinary',
      data: uploadResult,
      secure_url: uploadResult.secure_url,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload multiple images to Cloudinary
 * @route   POST /api/admin/upload/multiple
 * @access  Private (Admin / Manager)
 */
const uploadMultipleImages = async (req, res, next) => {
  try {
    const folder = req.body?.folder || 'luxury_fashion/products';

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one image file',
      });
    }

    const uploadPromises = req.files.map((file) =>
      cloudinaryService.uploadBuffer(file.buffer, {
        folder,
        filename_override: file.originalname,
      })
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${results.length} images successfully uploaded to Cloudinary`,
      data: results,
      urls: results.map((r) => r.secure_url),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an image from Cloudinary
 * @route   DELETE /api/admin/upload
 * @route   POST /api/admin/upload/delete
 * @access  Private (Admin / Manager)
 */
const deleteImage = async (req, res, next) => {
  try {
    const publicId =
      req.body?.public_id ||
      req.query?.public_id ||
      req.params?.publicId ||
      cloudinaryService.extractPublicIdFromUrl(req.body?.url);

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'public_id or Cloudinary image URL is required for deletion',
      });
    }

    const deleteResult = await cloudinaryService.deleteImage(publicId);

    res.status(200).json({
      success: deleteResult.success,
      message: deleteResult.success
        ? `Image ${publicId} successfully deleted from Cloudinary`
        : `Could not delete image: ${deleteResult.result || deleteResult.error}`,
      data: deleteResult,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMiddleware,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
};
