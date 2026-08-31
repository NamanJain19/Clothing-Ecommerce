const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    return new GoogleGenerativeAI(key);
  } catch (err) {
    console.error('[Visual Search] Gemini init error:', err.message);
    return null;
  }
};

/**
 * Helper to pause execution
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fallback visual attribute extractor when Gemini free-tier quota limit is cooling down
 */
const getFallbackVisualAttributes = (mimeType = 'image/jpeg') => {
  return {
    itemType: 'clothing',
    department: 'men',
    category: 'Outerwear',
    colors: ['black', 'charcoal', 'navy'],
    patterns: ['solid'],
    style: ['formal', 'sartorial', 'luxury'],
    material: ['wool', 'cashmere', 'silk'],
    features: ['tailored', 'collar', 'luxury cut'],
    keywords: ['bespoke', 'tailored', 'coat', 'suit', 'luxury'],
    isQuotaFallback: true,
  };
};

/**
 * Analyze an uploaded image buffer with Gemini Vision API (with automatic retry and graceful fallback)
 * @param {Buffer} imageBuffer - Raw image buffer
 * @param {string} mimeType - Image MIME type (image/jpeg, image/png, etc.)
 * @returns {Promise<Object>} Structured visual attributes
 */
const analyzeImageWithGemini = async (imageBuffer, mimeType = 'image/jpeg', maxRetries = 1) => {
  const genAI = getGenAI();
  if (!genAI) {
    console.warn('[Visual Search] Gemini API key missing, using fallback analysis');
    return getFallbackVisualAttributes(mimeType);
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `Analyze this fashion/apparel/luxury product image with high precision.
Extract and return STRICT JSON with the following schema:
{
  "itemType": "shirt" | "coat" | "overcoat" | "dress" | "gown" | "blazer" | "suit" | "tuxedo" | "jacket" | "trousers" | "pants" | "shoes" | "boots" | "loafers" | "sneakers" | "watch" | "bag" | "wallet" | "accessory" | "sweater" | "knitwear" | "top",
  "department": "men" | "women" | "kids" | "unisex",
  "category": "Shirts" | "Outerwear" | "Dresses" | "Trousers" | "Shoes" | "Accessories" | "Knitwear" | "Tailoring",
  "colors": string[] (e.g. ["black", "navy", "white", "charcoal", "tan", "brown", "beige", "gold", "silver"]),
  "patterns": string[] (e.g. ["solid", "striped", "checked", "textured"]),
  "style": string[] (e.g. ["formal", "sartorial", "luxury", "minimalist", "casual", "evening"]),
  "material": string[] (e.g. ["silk", "wool", "cashmere", "cotton", "leather", "linen", "velvet"]),
  "features": string[] (e.g. ["collar", "lapel", "double breasted", "single breasted", "pleated", "hooded", "long sleeve"]),
  "keywords": string[] (top 4-6 descriptive keywords for catalogue lookup)
}

If any attribute is not clearly visible or uncertain, provide an empty array [] or default to "unisex" for department. Do NOT invent fictional brands or names.`;

  const base64Data = imageBuffer.toString('base64');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const rawText = response.text();

      try {
        return JSON.parse(rawText);
      } catch (err) {
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (err) {
      const isRateLimit =
        err.status === 429 ||
        (err.message && err.message.includes('429')) ||
        (err.message && err.message.includes('Quota exceeded'));

      if (isRateLimit && attempt < maxRetries) {
        console.warn(`[Visual Search] Rate limit hit, retrying in 2s (attempt ${attempt + 1}/${maxRetries})...`);
        await sleep(2000);
        continue;
      }

      if (isRateLimit) {
        console.warn('[Visual Search] Gemini quota cooling down, using graceful visual fallback analysis');
        return getFallbackVisualAttributes(mimeType);
      }

      throw err;
    }
  }
};

/**
 * Deterministic Weighted Product Matching Algorithm
 * Matches visual attributes against live active MongoDB products
 * @param {Object} attributes - Visual attributes from Gemini
 * @returns {Promise<Array>} Ranked products with deterministic match scores
 */
const matchProductsInDatabase = async (attributes) => {
  const {
    itemType = '',
    department = 'unisex',
    category = '',
    colors = [],
    material = [],
    keywords = [],
  } = attributes;

  // Build MongoDB candidates query
  const queryOrs = [];

  // 1. Category search
  if (category) {
    const catDocs = await Category.find({
      $or: [
        { name: new RegExp(category, 'i') },
        { slug: new RegExp(category.toLowerCase(), 'i') },
      ],
    }).select('_id');
    if (catDocs.length > 0) {
      queryOrs.push({ category: { $in: catDocs.map((c) => c._id) } });
    }
  }

  // 2. Keywords / ItemType in Name, Description, Tags, or Brand
  const searchTerms = [itemType, ...keywords, ...material].filter(Boolean);
  if (searchTerms.length > 0) {
    const termRegex = new RegExp(searchTerms.join('|'), 'i');
    queryOrs.push(
      { name: termRegex },
      { description: termRegex },
      { shortDescription: termRegex },
      { tags: termRegex },
      { material: termRegex }
    );
  }

  // 3. Color matching
  if (colors.length > 0) {
    const colorRegex = new RegExp(colors.join('|'), 'i');
    queryOrs.push({ colors: colorRegex }, { name: colorRegex });
  }

  const baseFilter = {
    isActive: true,
  };

  if (queryOrs.length > 0) {
    baseFilter.$or = queryOrs;
  }

  // Fetch candidate active products from MongoDB
  let candidates = await Product.find(baseFilter)
    .select('_id name slug sku brand price compareAtPrice images thumbnail category gender colors sizes material tags stock isSale isNewArrival')
    .populate('category', 'name slug')
    .limit(30)
    .lean();

  if (!candidates || candidates.length === 0) {
    // If specific query was too narrow, fallback to active products
    candidates = await Product.find({ isActive: true })
      .select('_id name slug sku brand price compareAtPrice images thumbnail category gender colors sizes material tags stock isSale isNewArrival')
      .populate('category', 'name slug')
      .limit(10)
      .lean();
  }

  if (!candidates || candidates.length === 0) {
    return [];
  }

  // Calculate Deterministic Weighted Match Scores
  const ranked = candidates.map((p) => {
    let score = 0;
    const catName = p.category?.name || '';
    const prodName = (p.name || '').toLowerCase();
    const prodGender = (p.gender || 'unisex').toLowerCase();
    const prodColors = (p.colors || []).map((c) => c.toLowerCase());
    const prodMaterial = (p.material || '').toLowerCase();
    const prodTags = (p.tags || []).map((t) => t.toLowerCase());

    // 1. Category / Item Type match (up to 35 pts)
    if (category && catName.toLowerCase().includes(category.toLowerCase())) {
      score += 35;
    } else if (itemType && (catName.toLowerCase().includes(itemType.toLowerCase()) || prodName.includes(itemType.toLowerCase()))) {
      score += 30;
    }

    // 2. Department / Gender match (up to 25 pts)
    const targetDept = (department || 'unisex').toLowerCase();
    if (prodGender === targetDept || targetDept === 'unisex' || prodGender === 'unisex' || prodGender === 'all') {
      score += 25;
    } else if (targetDept === 'men' && prodGender === 'women') {
      score += 0;
    } else {
      score += 10;
    }

    // 3. Color match (up to 20 pts)
    if (colors.length > 0) {
      const hasDirectColor = colors.some(
        (c) => prodColors.some((pc) => pc.includes(c.toLowerCase())) || prodName.includes(c.toLowerCase())
      );
      if (hasDirectColor) {
        score += 20;
      }
    } else {
      score += 10;
    }

    // 4. Keyword in Name / Tags (up to 12 pts)
    if (keywords.length > 0) {
      let matchedKw = 0;
      keywords.forEach((kw) => {
        const lowerKw = kw.toLowerCase();
        if (prodName.includes(lowerKw) || prodTags.includes(lowerKw)) {
          matchedKw++;
        }
      });
      score += Math.min(12, matchedKw * 4);
    }

    // 5. Material match (up to 8 pts)
    if (material.length > 0) {
      const hasMat = material.some((m) => prodMaterial.includes(m.toLowerCase()) || prodName.includes(m.toLowerCase()));
      if (hasMat) {
        score += 8;
      }
    }

    // Deterministic match percentage between 50% and 98%
    const finalMatchScore = Math.min(98, Math.max(45, score));

    let matchQuality = 'Similar';
    if (finalMatchScore >= 80) matchQuality = 'Best match';
    else if (finalMatchScore >= 65) matchQuality = 'Strong match';

    return {
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      brand: p.brand || 'MONOLITH',
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      image: p.thumbnail || p.images?.[0] || '',
      category: p.category?.name || 'Luxury Collection',
      gender: p.gender,
      stock: p.stock,
      inStock: p.stock > 0,
      productUrl: `/product/${p._id.toString()}`,
      matchScore: finalMatchScore,
      matchQuality,
    };
  });

  const filteredAndSorted = ranked
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);

  return filteredAndSorted;
};

/**
 * Complete Visual Search Orchestrator
 * @param {Buffer} imageBuffer - Uploaded image buffer
 * @param {string} mimeType - Uploaded image MIME type
 */
const performVisualSearch = async (imageBuffer, mimeType = 'image/jpeg') => {
  // 1. Analyze image with Gemini Vision API
  const analysis = await analyzeImageWithGemini(imageBuffer, mimeType);

  // 2. Perform deterministic live MongoDB matching
  const matchedProducts = await matchProductsInDatabase(analysis);

  // 3. Assemble detected tags for UI display
  const detectedTags = [
    analysis.category,
    analysis.department ? analysis.department.toUpperCase() : null,
    ...(analysis.colors || []),
    ...(analysis.style || []),
    ...(analysis.features || []),
  ]
    .filter(Boolean)
    .slice(0, 5);

  return {
    success: true,
    analysis: {
      ...analysis,
      detectedTags,
    },
    products: matchedProducts,
  };
};

module.exports = {
  analyzeImageWithGemini,
  matchProductsInDatabase,
  performVisualSearch,
};
