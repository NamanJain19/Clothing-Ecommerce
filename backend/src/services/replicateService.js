const Product = require('../models/Product');
const cloudinaryService = require('./cloudinaryService');

const getReplicateToken = () => {
  return process.env.REPLICATE_API_TOKEN || '';
};

// Official SOTA IDM-VTON model version on Replicate
const IDM_VTON_VERSION = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';

/**
 * Maps product category / name to IDM-VTON category
 * @param {Object} product - MongoDB product document
 * @returns {string} 'upper_body' | 'lower_body' | 'dresses'
 */
const resolveGarmentCategory = (product) => {
  const catName = (typeof product.category === 'object' ? product.category?.name : product.category) || '';
  const name = (product.name || '').toLowerCase();
  const lowerCat = catName.toLowerCase();

  if (lowerCat.includes('dress') || name.includes('dress') || name.includes('gown') || name.includes('tuxedo') || name.includes('suit') || name.includes('jumpsuit')) {
    return 'dresses';
  }
  if (lowerCat.includes('pant') || lowerCat.includes('trouser') || lowerCat.includes('skirt') || name.includes('pant') || name.includes('trouser') || name.includes('short') || name.includes('jean')) {
    return 'lower_body';
  }
  return 'upper_body'; // shirts, t-shirts, jackets, coats, blazers, sweaters, tops
};

/**
 * Creates and awaits a real Replicate Virtual Try-On prediction
 * @param {Object} params
 * @param {string} params.humanImageUrl - Image URL or Base64 Data URI of customer
 * @param {string} params.garmentImageUrl - Image URL of garment from Cloudinary
 * @param {string} params.garmentDescription - Name/Description of garment
 * @param {string} params.category - 'upper_body' | 'lower_body' | 'dresses'
 * @returns {Promise<string>} Generated Try-On Result URL
 */
const runReplicateTryOn = async ({
  humanImageUrl,
  garmentImageUrl,
  garmentDescription = 'Luxury Atelier Garment',
  category = 'upper_body',
}) => {
  const token = getReplicateToken();
  if (!token) {
    throw new Error('REPLICATE_API_TOKEN is not configured on the backend');
  }

  // 1. Submit prediction to Replicate
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: IDM_VTON_VERSION,
      input: {
        human_img: humanImageUrl,
        garm_img: garmentImageUrl,
        category,
        garment_des: garmentDescription,
        crop: false,
        steps: 30,
        seed: 42,
      },
    }),
  });

  if (!createResponse.ok) {
    const errorBody = await createResponse.json().catch(() => ({}));
    if (createResponse.status === 402) {
      throw new Error(
        'Replicate GPU quota exhausted. Please check billing at replicate.com/account/billing.'
      );
    }
    throw new Error(
      errorBody.detail || errorBody.title || `Replicate API error (${createResponse.status})`
    );
  }

  const prediction = await createResponse.json();
  const predictionId = prediction.id;

  if (!predictionId) {
    throw new Error('Failed to create Replicate Virtual Try-On prediction');
  }

  // 2. Poll prediction until completion (up to 90 seconds timeout)
  const maxAttempts = 30; // 30 * 3s = 90s
  let currentStatus = prediction.status;
  let resultOutput = null;

  for (let i = 0; i < maxAttempts; i++) {
    if (currentStatus === 'succeeded') {
      resultOutput = prediction.output;
      break;
    }

    if (currentStatus === 'failed' || currentStatus === 'canceled') {
      throw new Error(
        prediction.error || 'Virtual Try-On prediction failed during neural rendering'
      );
    }

    await new Promise((r) => setTimeout(r, 3000));

    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!pollResponse.ok) {
      throw new Error(`Failed to check prediction status (${pollResponse.status})`);
    }

    const updated = await pollResponse.json();
    currentStatus = updated.status;
    if (updated.status === 'succeeded') {
      resultOutput = updated.output;
      break;
    }
    if (updated.status === 'failed') {
      throw new Error(updated.error || 'Virtual Try-On model failed to generate image');
    }
  }

  if (!resultOutput) {
    throw new Error('Virtual Try-On generation timed out. Please try again.');
  }

  // Normalize result output URL (Replicate might return a string or array of strings)
  const rawUrl = Array.isArray(resultOutput) ? resultOutput[0] : resultOutput;

  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid output received from Virtual Try-On model');
  }

  // 3. Optionally upload the result to Cloudinary in 'ai/virtual-try-on/' folder for persistent caching
  try {
    const cloudUpload = await cloudinaryService.uploadSource(rawUrl, {
      folder: 'ai/virtual-try-on',
      tags: ['virtual_try_on', 'ai_generated'],
    });
    if (cloudUpload && cloudUpload.secure_url) {
      return cloudUpload.secure_url;
    }
  } catch (cloudErr) {
    console.warn('[Replicate VTON] Cloudinary backup upload warning:', cloudErr.message);
  }

  return rawUrl;
};

/**
 * High-level Virtual Try-On handler that verifies MongoDB product and delegates to Replicate
 * @param {Object} params
 * @param {string} params.humanImage - Customer photo (Data URI or URL)
 * @param {string} params.productId - Valid MongoDB Product ID
 * @returns {Promise<Object>} Try-On result data
 */
const performVirtualTryOn = async ({ humanImage, productId }) => {
  if (!productId) {
    throw new Error('Product ID is required for Virtual Try-On');
  }

  if (!humanImage) {
    throw new Error('Customer person photo is required for Virtual Try-On');
  }

  // 1. Fetch real product from MongoDB
  const product = await Product.findById(productId).populate('category', 'name slug');
  if (!product || !product.isActive) {
    throw new Error('Selected product was not found or is currently inactive');
  }

  // 2. Resolve genuine Cloudinary product image
  let garmentImageUrl = product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : null);
  if (!garmentImageUrl) {
    garmentImageUrl = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80';
  }

  // 3. Resolve category (upper_body, lower_body, dresses)
  const vtonCategory = resolveGarmentCategory(product);

  // 4. Run real Replicate IDM-VTON inference
  const tryOnResultUrl = await runReplicateTryOn({
    humanImageUrl: humanImage,
    garmentImageUrl,
    garmentDescription: `${product.brand || 'MONOLITH'} ${product.name}`,
    category: vtonCategory,
  });

  return {
    success: true,
    resultImageUrl: tryOnResultUrl,
    product: {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: garmentImageUrl,
      category: typeof product.category === 'object' ? product.category?.name : product.category,
    },
    meta: {
      vtonModel: 'cuuupid/idm-vton',
      garmentCategory: vtonCategory,
      timestamp: new Date().toISOString(),
    },
  };
};

module.exports = {
  getReplicateToken,
  resolveGarmentCategory,
  runReplicateTryOn,
  performVirtualTryOn,
};
