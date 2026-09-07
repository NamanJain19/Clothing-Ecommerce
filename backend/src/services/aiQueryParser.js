/**
 * AI Query Parser & Intent Normalization Engine
 * Handles English, Hindi, and Hinglish e-commerce terminology,
 * currency formats (₹, Rs, 3k, 3000 ke andar, three thousand, between 2000 and 4000),
 * department/gender aliases, garment types, colors, sizes, and operational intent classification.
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

// Garment Types & Category Aliases (with proper singular and plural regex)
const GARMENT_MAP = [
  { type: 'shirt', label: 'Shirts', regex: /\b(shirts?|t-?shirts?|tees?|kurta|polo|topwear|tops?)\b/i },
  { type: 'dress', label: 'Dresses', regex: /\b(dress(es)?|gowns?|sundress(es)?|froks?|maxi|skirts?)\b/i },
  { type: 'outerwear', label: 'Outerwear', regex: /\b(jackets?|coats?|overcoats?|blazers?|suits?|tuxedos?|outerwear|winter wear)\b/i },
  { type: 'knitwear', label: 'Knitwear', regex: /\b(knitwears?|sweaters?|cardigans?|cashmere|pullovers?|turtlenecks?)\b/i },
  { type: 'trouser', label: 'Trousers', regex: /\b(trousers?|pants?|jeans?|bottomwear|chinos?)\b/i },
  { type: 'shoe', label: 'Shoes', regex: /\b(shoes?|footwear|sneakers?|loafers?|boots?|oxfords?|joota|joote)\b/i },
  { type: 'accessory', label: 'Accessories', regex: /\b(accessories|accessory|watches?|bags?|wallets?|belts?|silk scarves?|sunglasses?|neckties?|ties?|cravats?|gloves?|keyrings?|cufflinks?)\b/i },
];

// Greeting expressions
const GREETING_REGEX = /^(hi|hello|hey|greetings|namaste|good\s*(morning|afternoon|evening|day)|what\s+can\s+you\s+help\s+me\s+with|who\s+are\s+you|what\s+can\s+you\s+do|help\s*me\b\??|help\??)$/i;

// Word number conversions for natural price queries (e.g. "three thousand", "five thousand")
const WORD_NUMBERS = {
  'one thousand': 1000,
  'two thousand': 2000,
  'three thousand': 3000,
  'four thousand': 4000,
  'five thousand': 5000,
  'six thousand': 6000,
  'seven thousand': 7000,
  'eight thousand': 8000,
  'nine thousand': 9000,
  'ten thousand': 10000,
  'fifteen thousand': 15000,
  'twenty thousand': 20000,
  'twenty five thousand': 25000,
  'fifty thousand': 50000,
  'one lakh': 100000,
  '1 lakh': 100000,
  'ek hazar': 1000,
  'do hazar': 2000,
  'teen hazar': 3000,
  'char hazar': 4000,
  'paanch hazar': 5000,
  'das hazar': 10000,
};

/**
 * Normalize word numbers in text into numeric strings
 */
const normalizeWordNumbers = (text) => {
  let result = text;
  for (const [w, n] of Object.entries(WORD_NUMBERS)) {
    result = result.replace(new RegExp(`\\b${w}\\b`, 'gi'), n.toString());
  }
  return result;
};

/**
 * Normalize price strings into numeric bounds
 * Handles: ₹3000, Rs 3000, 3k, 3.5k, 3000 ke andar, under 3000, below 3000,
 * between 2000 and 4000, 2000 se 4000 ke beech, three thousand, etc.
 */
const extractPriceFilters = (text) => {
  const normalized = normalizeWordNumbers(text);
  let maxPrice = undefined;
  let minPrice = undefined;

  // 1. "between 2000 and 4000", "from 2000 to 4000", "2000 se 4000 ke beech"
  const betweenMatch = normalized.match(/(?:between|from|ke beech|se)?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)(?:\s*k)?\s*(?:and|to|-|se)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)(?:\s*k)?/i);
  if (betweenMatch && betweenMatch[1] && betweenMatch[2]) {
    let p1 = parseInt(betweenMatch[1].replace(/,/g, ''), 10);
    let p2 = parseInt(betweenMatch[2].replace(/,/g, ''), 10);
    if (/k\b/i.test(betweenMatch[0])) {
      if (betweenMatch[1].toLowerCase().includes('k') || p1 < 100) p1 *= 1000;
      if (betweenMatch[2].toLowerCase().includes('k') || p2 < 100) p2 *= 1000;
    }
    minPrice = Math.min(p1, p2);
    maxPrice = Math.max(p1, p2);
    return { minPrice, maxPrice };
  }

  // 2. "3k", "3.5k", "10k" formats
  const kMatch = normalized.match(/(?:under|below|less than|budget|upto|up to|ke andar|se kam|tak)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    maxPrice = Math.round(parseFloat(kMatch[1]) * 1000);
  }

  // 3. "under 3000", "3000 ke andar", "below ₹3,000", "3000 se kam"
  if (!maxPrice) {
    const underMatch = normalized.match(/(?:under|below|less than|budget|upto|up to|max|maximum|ke neeche)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
    if (underMatch) {
      maxPrice = parseInt(underMatch[1].replace(/,/g, ''), 10);
    }
  }

  if (!maxPrice) {
    const hindiUnderMatch = normalized.match(/(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:rupees?|inr)?\s*(?:ke andar|se kam|tak|ke neeche)/i);
    if (hindiUnderMatch) {
      maxPrice = parseInt(hindiUnderMatch[1].replace(/,/g, ''), 10);
    }
  }

  // 4. Minimum price: "above 2000", "2000 se jyada", "more than 2000"
  const overMatch = normalized.match(/(?:above|over|more than|minimum|min)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (overMatch) {
    minPrice = parseInt(overMatch[1].replace(/,/g, ''), 10);
  } else {
    const hindiOverMatch = normalized.match(/(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:rupees?|inr)?\s*(?:se jyada|se upar|se adhik)/i);
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
 * Extract Clothing Size safely without false matching 's in Men's or Women's
 */
const extractSize = (text) => {
  const clean = text.replace(/['’]s\b/gi, ' ').trim();

  // Explicit size: "size S", "size: 42", "size M", "sz XL"
  const explicitSizeMatch = clean.match(/\b(?:size|sz|no\.?|number)\s*[:=]?\s*(xs|s|m|l|xl|xxl|xxxl|28|30|32|34|36|38|40|42|44|46)\b/i);
  if (explicitSizeMatch) {
    return explicitSizeMatch[1].toUpperCase();
  }

  // Multi-letter size abbreviations: XS, XL, XXL, XXXL
  const multiLetterMatch = clean.match(/\b(xs|xxl|xxxl|xl)\b/i);
  if (multiLetterMatch) {
    return multiLetterMatch[1].toUpperCase();
  }

  return undefined;
};

/**
 * Common conversational stop words to strip from product keyword searches
 */
const STOP_WORDS_REGEX = /\b(show|showing|find|search|get|give|please|i|need|want|looking\s+for|tell\s+me|details|what\s+is|price\s+of|chahiye|dikhao|dikha|batao|bata|kya\s+hai|hai|hain|kuch|wali|wale|wala|ke|ka|ki|ko|me|mein|se|tak|par|products?|clothes|kapde|items?|collections?|piece|pieces?|samaan|stuff|something|anything|for|in|on|with|a|an|the|can\s+you|could\s+you|would\s+you|are\s+there|have\s+you|got|any|some|all|available|latest|new|fresh|recent|arrivals?|sale|discount|offers?|deals?|private\s+sale|cheap|sasta|kam\s+daam|budget)\b/gi;

/**
 * Parse and normalize user query into structured search intent
 */
const parseUserQuery = (rawQuery) => {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { intent: 'greeting', rawQuery: '' };
  }

  const text = rawQuery.trim();
  const lower = text.toLowerCase();

  // 1. General Greeting intent ("Hello", "Hi", "Namaste", "What can you help me with?")
  const sanitizedForGreeting = text.replace(/[?!.,]/g, '').trim();
  if (GREETING_REGEX.test(sanitizedForGreeting)) {
    return {
      intent: 'greeting',
      rawQuery: text,
    };
  }

  // 2. Order Tracking intent ("Where is my order?", "Where's my latest order?", "Track my order", "ORD-...")
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

  // 3. Policy / Sizing intent ("14-Day Return Policy", "Return policy", "Shipping", "Size guide")
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

  // 4. Specific single product details
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

  // 5. Product Search / Browsing Intent
  // Extract Gender / Department
  let gender = undefined;
  for (const g of GENDER_PATTERNS) {
    if (g.regex.test(text)) {
      gender = g.gender;
      break;
    }
  }

  // Extract Garment Type & Category
  let garmentType = undefined;
  let category = undefined;
  for (const gm of GARMENT_MAP) {
    if (gm.regex.test(text)) {
      garmentType = gm.type;
      category = gm.label;
      break;
    }
  }

  // Extract Price Bounds (supporting numbers, words, and ranges)
  const { minPrice, maxPrice } = extractPriceFilters(text);

  // Extract Color & Size
  const color = extractColor(text);
  const size = extractSize(text);

  // Extract Sale / New Arrival
  const onSale = /\b(sale|discount|offer|offers|deal|deals|sasta|kam daam|private sale|on sale)\b/i.test(text);
  const newArrival = /\b(new|latest|naya|naye|new arrival|new arrivals|fresh|recent)\b/i.test(text);

  // Clean keywords for targeted text search
  const textWithNormalizedNumbers = normalizeWordNumbers(text);
  let cleanedKeywords = textWithNormalizedNumbers
    .replace(STOP_WORDS_REGEX, ' ')
    .replace(/(?:between|from)?\s*(?:₹|rs\.?|inr)?\s*[\d,]+(?:\s*k)?\s*(?:and|to|-)\s*(?:₹|rs\.?|inr)?\s*[\d,]+(?:\s*k)?/gi, ' ')
    .replace(/(?:under|below|less than|budget|upto|up to|above|over|more than|se kam|ke andar|se jyada|tak|max|min)\s*(?:₹|rs\.?|inr)?\s*[\d,]+(?:\s*k)?/gi, ' ')
    .replace(/(?:₹|rs\.?|inr)\s*[\d,]+(?:\s*k)?/gi, ' ')
    .replace(/\b[\d,]+(?:\s*k)?\b/gi, ' ')
    .replace(/\b(men|mens|men's|male|gents|women|womens|women's|female|ladies|kids|children|boys|girls|unisex)\b/gi, ' ')
    .replace(/\b(shirts?|t-?shirts?|tees?|kurta|polo|dresses?|gowns?|sundresses?|maxi|skirts?|jackets?|coats?|overcoats?|blazers?|suits?|tuxedos?|outerwear|sweaters?|cardigans?|trousers?|pants?|jeans?|shoes?|sneakers?|loafers?|accessories|bags?|belts?)\b/gi, ' ')
    .replace(/['’]s\b/gi, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If after stripping the string is empty or just generic, leave undefined so database uses category/gender/badge filters
  if (!cleanedKeywords || cleanedKeywords.length < 2) {
    cleanedKeywords = undefined;
  }

  return {
    intent: 'product_search',
    gender,
    garmentType,
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
  GARMENT_MAP,
};
