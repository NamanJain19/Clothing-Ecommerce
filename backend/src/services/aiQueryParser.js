/**
 * AI Query Parser & Intent Normalization Engine
 * Handles English, Hindi, and Hinglish e-commerce terminology,
 * currency formats (₹, Rs, 3k, 3000 ke andar), department/gender aliases,
 * categories, colors, sizes, and operational intent classification.
 */

// Comprehensive Department / Gender mappings
const GENDER_PATTERNS = [
  {
    gender: 'men',
    regex: /\b(men|mens|men's|male|gents|gent|menswear|menwear|ladko|ladke|mard|purush)\b|\b(for men|men ke|men ki|men ka|men wali|men wale|mens ke|gents ke)\b/i,
  },
  {
    gender: 'women',
    regex: /\b(women|womens|women's|female|ladies|lady|womenswear|womenwear|ladki|ladkiyo|ladkiyon|aurat|mahila)\b|\b(for women|women ke|women ki|women ka|women wali|women wale|ladies ke|ladkiyon ke)\b/i,
  },
  {
    gender: 'kids',
    regex: /\b(kids|kid|children|child|boys|boy|girls|girl|kidswear|bacho|bachhe|chote bache|boys ke|girls ke|kids ke)\b/i,
  },
];

// Category Aliases
const CATEGORY_MAP = [
  { category: 'Shirts', regex: /\b(shirts?|t-?shirts?|tees?|kurta|polo|topwear|tops?)\b/i },
  { category: 'Outerwear', regex: /\b(jackets?|coats?|overcoats?|blazers?|suits?|tuxedos?|outerwear|winter wear)\b/i },
  { category: 'Dresses', regex: /\b(dresses?|gowns?|froks?|maxi|skirts?)\b/i },
  { category: 'Knitwear', regex: /\b(knitwears?|sweaters?|cardigans?|cashmere pullovers?)\b/i },
  { category: 'Trousers', regex: /\b(trousers?|pants?|jeans?|bottomwear|chinos?)\b/i },
  { category: 'Shoes', regex: /\b(shoes?|footwear|sneakers?|loafers?|boots?|oxfords?|joota|joote)\b/i },
  { category: 'Accessories', regex: /\b(accessories|accessory|watches?|bags?|wallets?|belts?|silk scarves?|sunglasses?)\b/i },
];

// Common Indian / Hinglish conversational stop words to strip from product keyword search
const STOP_WORDS_REGEX = /\b(show|showing|find|search|get|give|please|i want|looking for|need|tell me|details|what is|price of|chahiye|dikhao|dikha|batao|bata|kya hai|hai|hain|kuch|wali|wale|wala|ke|ka|ki|ko|me|mein|se|tak|par|products?|clothes|kapde|items?|collections?|piece|pieces?|samaan|stuff)\b/gi;

/**
 * Normalize price strings into numeric bounds
 * Handles: ₹3000, Rs 3000, 3k, 3.5k, 3000 ke andar, under 3000, 3000 se kam, etc.
 */
const extractPriceFilters = (text) => {
  let maxPrice = undefined;
  let minPrice = undefined;

  // 1. "3k", "3.5k", "10k" formats
  const kMatch = text.match(/(?:under|below|less than|budget|upto|up to|ke andar|se kam|tak)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    maxPrice = Math.round(parseFloat(kMatch[1]) * 1000);
  }

  // 2. "under 3000", "3000 ke andar", "below ₹3,000", "3000 se kam"
  if (!maxPrice) {
    const underMatch = text.match(/(?:under|below|less than|budget|upto|up to|max|maximum)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
    if (underMatch) {
      maxPrice = parseInt(underMatch[1].replace(/,/g, ''), 10);
    }
  }

  if (!maxPrice) {
    const hindiUnderMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:rupees?|inr)?\s*(?:ke andar|se kam|tak|ke neeche)/i);
    if (hindiUnderMatch) {
      maxPrice = parseInt(hindiUnderMatch[1].replace(/,/g, ''), 10);
    }
  }

  // 3. Minimum price: "above 2000", "2000 se jyada", "more than 2000"
  const overMatch = text.match(/(?:above|over|more than|minimum|min)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (overMatch) {
    minPrice = parseInt(overMatch[1].replace(/,/g, ''), 10);
  } else {
    const hindiOverMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:rupees?|inr)?\s*(?:se jyada|se upar|se adhik)/i);
    if (hindiOverMatch) {
      minPrice = parseInt(hindiOverMatch[1].replace(/,/g, ''), 10);
    }
  }

  return { minPrice, maxPrice };
};

/**
 * Extract Color filter if mentioned
 */
const extractColor = (text) => {
  const colors = [
    { en: 'black', match: /\b(black|kala|kaali|kaale)\b/i },
    { en: 'white', match: /\b(white|safed|chitta|ivory)\b/i },
    { en: 'navy', match: /\b(navy|navy blue|dark blue)\b/i },
    { en: 'blue', match: /\b(blue|neela|neeli|neele)\b/i },
    { en: 'red', match: /\b(red|laal|maroon|burgundy)\b/i },
    { en: 'green', match: /\b(green|hara|hari|olive|emerald)\b/i },
    { en: 'grey', match: /\b(grey|gray|charcoal|slaty)\b/i },
    { en: 'brown', match: /\b(brown|tan|camel|cognac|khaki|beige)\b/i },
    { en: 'gold', match: /\b(gold|golden|sona)\b/i },
  ];

  for (const c of colors) {
    if (c.match.test(text)) return c.en;
  }
  return undefined;
};

/**
 * Extract Clothing Size
 */
const extractSize = (text) => {
  const sizeMatch = text.match(/\b(?:size|number)?\s*(xs|s|m|l|xl|xxl|38|40|42|44|46|48)\b/i);
  if (sizeMatch && !text.includes('rs') && !text.includes('k')) {
    return sizeMatch[1].toUpperCase();
  }
  return undefined;
};

/**
 * Parse and normalize user query into structured search intent
 */
const parseUserQuery = (rawQuery) => {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { intent: 'general', rawQuery: '' };
  }

  const text = rawQuery.trim();
  const lower = text.toLowerCase();

  // 1. Order Tracking intent
  if (
    lower.includes('order') ||
    lower.includes('track') ||
    lower.includes('ord-') ||
    lower.includes('kahan hai') ||
    lower.includes('kab aayega') ||
    lower.includes('delivery status') ||
    lower.includes('consignment')
  ) {
    const orderMatch = text.match(/ORD-[\w\d-]+/i);
    return {
      intent: 'order_tracking',
      orderNumber: orderMatch ? orderMatch[0].toUpperCase() : null,
      rawQuery: text,
    };
  }

  // 2. Policy / Sizing intent
  if (
    lower.includes('return') ||
    lower.includes('refund') ||
    lower.includes('exchange') ||
    lower.includes('wapas') ||
    lower.includes('shipping policy') ||
    lower.includes('delivery time') ||
    lower.includes('size guide') ||
    lower.includes('sizing') ||
    lower.includes('payment method') ||
    lower.includes('cod')
  ) {
    let topic = 'all';
    if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange') || lower.includes('wapas')) topic = 'returns';
    else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('courier')) topic = 'shipping';
    else if (lower.includes('size') || lower.includes('sizing') || lower.includes('measurement')) topic = 'sizing';
    else if (lower.includes('payment') || lower.includes('cod')) topic = 'payments';

    return {
      intent: 'policy',
      topic,
      rawQuery: text,
    };
  }

  // 3. Specific single product details
  if (
    lower.includes('tell me about') ||
    lower.includes('what is the price of') ||
    lower.includes('price of') ||
    lower.includes('details of') ||
    lower.includes('ke bare me') ||
    lower.includes('ka price kya hai')
  ) {
    const cleanTarget = text
      .replace(/tell me about/gi, '')
      .replace(/what is the price of/gi, '')
      .replace(/price of/gi, '')
      .replace(/details of/gi, '')
      .replace(/ke bare me batao/gi, '')
      .replace(/ka price kya hai/gi, '')
      .replace(/[?.]/g, '')
      .trim();

    return {
      intent: 'product_details',
      target: cleanTarget,
      rawQuery: text,
    };
  }

  // 4. Product Search / Browsing Intent
  // Extract Gender / Department
  let gender = undefined;
  for (const g of GENDER_PATTERNS) {
    if (g.regex.test(text)) {
      gender = g.gender;
      break;
    }
  }

  // Extract Category
  let category = undefined;
  for (const c of CATEGORY_MAP) {
    if (c.regex.test(text)) {
      category = c.category;
      break;
    }
  }

  // Extract Price Bounds
  const { minPrice, maxPrice } = extractPriceFilters(text);

  // Extract Color & Size
  const color = extractColor(text);
  const size = extractSize(text);

  // Extract Sale / New Arrival
  const onSale = /\b(sale|discount|offer|deal|sasta|kam daam|private sale)\b/i.test(text);
  const newArrival = /\b(new|latest|naya|naye|new arrival|new arrivals|fresh|recent)\b/i.test(text);

  // Generate Clean Product Search Keyword for MongoDB
  let cleanedKeywords = text
    .replace(STOP_WORDS_REGEX, ' ')
    .replace(/(?:under|below|less than|budget|upto|up to|above|over|more than|se kam|ke andar|se jyada|tak)\s*(?:₹|rs\.?|inr)?\s*[\d,]+(?:\s*k)?/gi, ' ')
    .replace(/(?:₹|rs\.?|inr)\s*[\d,]+/gi, ' ')
    .replace(/\b(men|mens|men's|male|gents|women|womens|women's|female|ladies|kids|children|boys|girls)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If after stripping the string is empty or just generic, leave undefined so database uses category/gender filters
  if (!cleanedKeywords || cleanedKeywords.length < 2) {
    cleanedKeywords = undefined;
  }

  return {
    intent: 'product_search',
    gender,
    category,
    minPrice,
    maxPrice,
    color,
    size,
    onSale: onSale || undefined,
    newArrival: newArrival || undefined,
    keywords: cleanedKeywords,
    rawQuery: text,
  };
};

module.exports = {
  parseUserQuery,
  extractPriceFilters,
  extractColor,
  GENDER_PATTERNS,
};
