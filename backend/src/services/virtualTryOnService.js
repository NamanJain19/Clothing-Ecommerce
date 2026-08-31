const Product = require('../models/Product');
const cloudinaryService = require('./cloudinaryService');

const getVtonProvider = () => {
  return process.env.VTON_PROVIDER || 'huggingface';
};

const getReplicateToken = () => {
  return process.env.REPLICATE_API_TOKEN || '';
};

// Replicate model version for IDM-VTON
const REPLICATE_IDM_VTON_VERSION = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';

/**
 * Maps product category / name to IDM-VTON category
 * @param {Object} product - MongoDB product document
 * @returns {string} 'upper_body' | 'lower_body' | 'dresses'
 */
const resolveGarmentCategory = (product) => {
  const catName = (typeof product.category === 'object' ? product.category?.name : product.category) || '';
  const name = (product.name || '').toLowerCase();
  const lowerCat = catName.toLowerCase();

  if (
    lowerCat.includes('dress') ||
    name.includes('dress') ||
    name.includes('gown') ||
    name.includes('tuxedo') ||
    name.includes('suit') ||
    name.includes('jumpsuit')
  ) {
    return 'dresses';
  }
  if (
    lowerCat.includes('pant') ||
    lowerCat.includes('trouser') ||
    lowerCat.includes('skirt') ||
    name.includes('pant') ||
    name.includes('trouser') ||
    name.includes('short') ||
    name.includes('jean')
  ) {
    return 'lower_body';
  }
  return 'upper_body';
};

/**
 * Executes Virtual Try-On using the official Hugging Face IDM-VTON Space (yisol/IDM-VTON)
 * @param {Object} params
 * @param {string} params.humanImageUrl - Image URL or Data URI
 * @param {string} params.garmentImageUrl - Cloudinary/Public Image URL of garment
 * @param {string} params.garmentDescription - Garment description
 * @returns {Promise<string>} Generated image URL from Cloudinary
 */
const runHuggingFaceTryOn = async ({
  humanImageUrl,
  garmentImageUrl,
  garmentDescription = 'Luxury Atelier Garment',
}) => {
  console.log('[VTON:HuggingFace] Submitting IDM-VTON inference to yisol/IDM-VTON Space...');

  // 1. Submit prediction to Gradio /call/tryon
  const postRes = await fetch('https://yisol-idm-vton.hf.space/call/tryon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        { background: { path: humanImageUrl, url: humanImageUrl }, layers: [], composite: null },
        { path: garmentImageUrl, url: garmentImageUrl },
        garmentDescription,
        true, // auto-masking
        false, // crop
        30, // steps
        42, // seed
      ],
    }),
  });

  if (!postRes.ok) {
    const errText = await postRes.text().catch(() => '');
    throw new Error(`Hugging Face IDM-VTON Space request failed (${postRes.status}): ${errText}`);
  }

  const postData = await postRes.json();
  const eventId = postData.event_id;
  if (!eventId) {
    throw new Error('Failed to obtain event ID from Hugging Face IDM-VTON Space');
  }

  console.log(`[VTON:HuggingFace] Event ID: ${eventId}, streaming SSE output...`);

  // 2. Stream event source until completion
  const streamRes = await fetch(`https://yisol-idm-vton.hf.space/call/tryon/${eventId}`);
  if (!streamRes.ok) {
    throw new Error(`Failed to read Hugging Face try-on stream (${streamRes.status})`);
  }

  const sseText = await streamRes.text();

  // 3. Extract generated image URL
  const match = sseText.match(/event:\s*complete\s*\ndata:\s*(\[.*?\])/s);
  if (!match || !match[1]) {
    // Check if error event occurred
    const errMatch = sseText.match(/event:\s*error\s*\ndata:\s*(.*)/);
    if (errMatch) {
      throw new Error(`Hugging Face IDM-VTON generation error: ${errMatch[1]}`);
    }
    throw new Error('IDM-VTON generation did not return a valid completion event');
  }

  const parsed = JSON.parse(match[1]);
  const rawGeneratedUrl = parsed[0]?.url;

  if (!rawGeneratedUrl) {
    throw new Error('Invalid image output received from IDM-VTON Space');
  }

  console.log(`[VTON:HuggingFace] Generated output URL: ${rawGeneratedUrl}`);

  // 4. Download generated image buffer and upload to Cloudinary
  try {
    const imgFetch = await fetch(rawGeneratedUrl);
    if (imgFetch.ok) {
      const arrayBuf = await imgFetch.arrayBuffer();
      const buf = Buffer.from(arrayBuf);

      const cloudRes = await cloudinaryService.uploadBuffer(buf, {
        folder: 'ai/virtual-try-on',
        tags: ['idm_vton', 'huggingface_space', 'ai_generated'],
      });

      if (cloudRes && cloudRes.secure_url) {
        console.log(`[VTON:HuggingFace] Uploaded to Cloudinary: ${cloudRes.secure_url}`);
        return cloudRes.secure_url;
      }
    }
  } catch (cloudErr) {
    console.warn('[VTON:HuggingFace] Cloudinary buffer upload warning:', cloudErr.message);
  }

  return rawGeneratedUrl;
};

/**
 * Executes Virtual Try-On using Replicate IDM-VTON
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

  console.log('[VTON:Replicate] Submitting prediction to Replicate...');

  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: REPLICATE_IDM_VTON_VERSION,
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

  const maxAttempts = 30;
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

  const rawUrl = Array.isArray(resultOutput) ? resultOutput[0] : resultOutput;

  try {
    const imgFetch = await fetch(rawUrl);
    if (imgFetch.ok) {
      const arrayBuf = await imgFetch.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      const cloudRes = await cloudinaryService.uploadBuffer(buf, {
        folder: 'ai/virtual-try-on',
        tags: ['idm_vton', 'replicate', 'ai_generated'],
      });
      if (cloudRes && cloudRes.secure_url) {
        return cloudRes.secure_url;
      }
    }
  } catch (cloudErr) {
    console.warn('[VTON:Replicate] Cloudinary upload warning:', cloudErr.message);
  }

  return rawUrl;
};

/**
 * Multi-Provider Virtual Try-On Orchestrator
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
  let garmentImageUrl =
    product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : null);
  if (!garmentImageUrl) {
    garmentImageUrl =
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80';
  }

  // 3. Ensure human image is a clean public HTTPS URL (upload Base64 to Cloudinary if needed)
  let resolvedHumanImageUrl = humanImage;
  if (humanImage.startsWith('data:image') || !humanImage.startsWith('http')) {
    console.log('[VTON Orchestrator] Uploading customer base64 photo to Cloudinary temp storage...');
    try {
      const uploadRes = await cloudinaryService.uploadSource(humanImage, {
        folder: 'ai/temp-customer-uploads',
        tags: ['temp_vton_input'],
      });
      if (uploadRes && uploadRes.secure_url) {
        resolvedHumanImageUrl = uploadRes.secure_url;
        console.log(`[VTON Orchestrator] Customer photo hosted at: ${resolvedHumanImageUrl}`);
      }
    } catch (e) {
      console.warn('[VTON Orchestrator] Pre-upload warning:', e.message);
    }
  }

  // 4. Resolve category (upper_body, lower_body, dresses)
  const vtonCategory = resolveGarmentCategory(product);
  const garmentDescription = `${product.brand || 'MONOLITH'} ${product.name}`;

  const provider = getVtonProvider();
  let tryOnResultUrl = null;
  let activeProvider = provider;

  console.log(`[VTON Orchestrator] Starting inference for "${product.name}" using provider: ${provider}`);

  if (provider === 'replicate') {
    try {
      tryOnResultUrl = await runReplicateTryOn({
        humanImageUrl: resolvedHumanImageUrl,
        garmentImageUrl,
        garmentDescription,
        category: vtonCategory,
      });
    } catch (repErr) {
      if (repErr.message && (repErr.message.includes('quota') || repErr.message.includes('credit') || repErr.message.includes('402'))) {
        console.warn('[VTON Orchestrator] Replicate credit exhausted, falling back to Hugging Face Space...');
        activeProvider = 'huggingface (fallback)';
        tryOnResultUrl = await runHuggingFaceTryOn({
          humanImageUrl: resolvedHumanImageUrl,
          garmentImageUrl,
          garmentDescription,
        });
      } else {
        throw repErr;
      }
    }
  } else {
    // Default to Hugging Face IDM-VTON Space
    tryOnResultUrl = await runHuggingFaceTryOn({
      humanImageUrl: resolvedHumanImageUrl,
      garmentImageUrl,
      garmentDescription,
    });
  }

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
      provider: activeProvider,
      vtonModel: 'IDM-VTON (Improving Diffusion Models for Authentic Virtual Try-on)',
      licenseNotice: 'Research & Non-Commercial Demo Use Only (CC BY-NC-SA 4.0)',
      garmentCategory: vtonCategory,
      timestamp: new Date().toISOString(),
    },
  };
};

module.exports = {
  getVtonProvider,
  resolveGarmentCategory,
  runHuggingFaceTryOn,
  runReplicateTryOn,
  performVirtualTryOn,
};
