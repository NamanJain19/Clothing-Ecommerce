const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiToolService = require('./aiToolService');
const { parseUserQuery } = require('./aiQueryParser');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientGeminiError = (err) => {
  if (!err) return false;
  const status = err.status || err.statusCode;
  if (status === 503 || status === 500 || status === 504) return true;
  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('500') ||
    msg.includes('504') ||
    msg.includes('high demand') ||
    msg.includes('service unavailable') ||
    msg.includes('overloaded')
  );
};

const isQuotaError = (err) => {
  if (!err) return false;
  const status = err.status || err.statusCode;
  if (status === 429) return true;
  const msg = (err.message || '').toLowerCase();
  return msg.includes('429') || msg.includes('quota exceeded') || msg.includes('resourceexhausted');
};

let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (err) {
    console.error('[Gemini Service] Initialization error:', err.message);
  }
}

const SYSTEM_INSTRUCTION = `You are the AI Stylist & Concierge for MONOLITH Luxury Atelier, an ultra-luxury haute couture and bespoke fashion house.
Your personality is elegant, refined, attentive, sophisticated, and deeply knowledgeable about luxury fashion, materials, styling, and order care.

RULES:
1. When presenting products, ALWAYS reference the exact names, real prices in ₹ (INR), and stock availability provided in the LIVE DATABASE context.
2. NEVER invent fake products, fake prices, or fake tracking numbers.
3. If no matching products were found in the database, explicitly inform the user that no pieces matched their criteria (mention their category/budget) and offer to help them browse related collections or new arrivals. NEVER respond with a generic "Welcome to MONOLITH" greeting if they asked a product search, price query, or order inquiry.
4. For order tracking:
   - If the customer is not authenticated, gracefully ask them to sign in to access their live order tracking ledger.
   - If authenticated, report the real consignment status from the ledger.
5. For greetings (like "Hello", "Hi", "What can you help me with?"), warmly welcome the customer to MONOLITH Luxury Atelier and introduce what you can assist with (bespoke styling, exploring collections, budget curation, order tracking).
6. Always format Indian currency as ₹ with commas (e.g. ₹1,899, ₹3,499, ₹28,500).
7. You understand English, Hindi, and Hinglish naturally. Respond in a warm, sophisticated luxury tone that matches the customer's language.`;

/**
 * Execute real database search based on parsed intent
 */
const resolveDataFromDatabase = async (parsedQuery, user = null) => {
  const startTime = Date.now();
  let dbResult = { intent: parsedQuery.intent, products: [], textData: null };

  switch (parsedQuery.intent) {
    case 'greeting': {
      dbResult.textData = {
        greeting: true,
        message: 'Welcome to MONOLITH Luxury Atelier concierge service.',
      };
      break;
    }

    case 'order_tracking': {
      if (!user || !user._id) {
        dbResult.textData = {
          authenticated: false,
          message: 'Please sign in to your MONOLITH account to view your live orders and tracking status.',
        };
      } else {
        const orderData = await aiToolService.getCustomerOrders(user._id, parsedQuery.orderNumber);
        dbResult.textData = orderData;
      }
      break;
    }

    case 'policy': {
      dbResult.textData = aiToolService.getStorePolicies(parsedQuery.topic || 'all');
      break;
    }

    case 'product_details': {
      const product = await aiToolService.getProductDetails(parsedQuery.target);
      if (product) {
        dbResult.products = [product];
      }
      break;
    }

    case 'product_search':
    default: {
      const searchParams = {
        query: parsedQuery.keywords,
        gender: parsedQuery.gender,
        category: parsedQuery.category,
        garmentType: parsedQuery.garmentType,
        minPrice: parsedQuery.minPrice,
        maxPrice: parsedQuery.maxPrice,
        color: parsedQuery.color,
        size: parsedQuery.size,
        onSale: parsedQuery.onSale,
        newArrival: parsedQuery.newArrival,
        limit: 6,
      };

      const products = await aiToolService.searchCatalog(searchParams);
      dbResult.products = products;
      break;
    }
  }

  const durationMs = Date.now() - startTime;
  return { ...dbResult, durationMs };
};

/**
 * Format minimal, high-density context for Gemini
 */
const buildPromptContext = (parsedQuery, dbResult, userMessage) => {
  let contextSnippet = '';

  if (dbResult.intent === 'greeting') {
    contextSnippet = `[CUSTOMER GREETING]: The customer is greeting the atelier. Warmly welcome them as the MONOLITH Luxury Atelier Concierge and invite them to explore bespoke styling, men's or women's collections, price curation, or order status.`;
  } else if (dbResult.intent === 'order_tracking') {
    if (!dbResult.textData?.authenticated) {
      contextSnippet = `[AUTHENTICATION REQUIRED]: The user is asking about their order, but is not signed in. Politely and gracefully advise them to sign in to access their live order history and tracking ledger. Do NOT invent fake order details.`;
    } else if (!dbResult.textData.orders || dbResult.textData.orders.length === 0) {
      contextSnippet = `[NO ORDERS FOUND]: ${dbResult.textData.message || 'No active orders found in your MONOLITH account ledger.'}`;
    } else {
      const ordersSummary = dbResult.textData.orders.map(
        (o) =>
          `Order #${o.orderNumber} | Status: ${o.orderStatus} | Shipment: ${o.shipmentStatus} | Carrier: ${o.carrier} | AWB: ${o.awbNumber} | Estimated Delivery: ${
            o.estimatedDeliveryDate ? new Date(o.estimatedDeliveryDate).toLocaleDateString('en-IN') : '2-4 business days'
          } | Total: ₹${o.total}`
      ).join('\n');
      contextSnippet = `[LIVE ORDERS LEDGER]:\n${ordersSummary}`;
    }
  } else if (dbResult.intent === 'policy') {
    contextSnippet = `[STORE POLICIES]:\n${JSON.stringify(dbResult.textData)}`;
  } else if (dbResult.products && dbResult.products.length > 0) {
    const prodsSummary = dbResult.products
      .map(
        (p) =>
          `Product ID: ${p.id} | Name: ${p.name} | Price: ₹${p.price.toLocaleString('en-IN')}${
            p.compareAtPrice > p.price ? ` (Original: ₹${p.compareAtPrice.toLocaleString('en-IN')})` : ''
          } | Stock: ${p.stock > 0 ? `${p.stock} units (In Stock)` : 'OUT OF STOCK'} | Department: ${p.gender} | Category: ${p.category} | Material: ${p.material || 'Fine Fabric'} | Sizes: ${(p.sizes || []).join(', ')}`
      )
      .join('\n');
    contextSnippet = `[LIVE DATABASE PRODUCTS FOUND (${dbResult.products.length})]:\n${prodsSummary}`;
  } else {
    contextSnippet = `[LIVE DATABASE]: No matching active products found in the atelier for this query. Politely state that no pieces match their criteria (mention category/budget) and offer alternative collections or new arrivals. CRITICAL: Do NOT return a generic atelier welcome message.`;
  }

  return `Customer Inquiry: "${userMessage}"
Parsed Intent: ${JSON.stringify(parsedQuery)}
Real-Time Database Context:
${contextSnippet}

Task: Provide a concise, elegant, and helpful response to the customer. When presenting products, reference their actual prices and in-stock status accurately. If no products were found, explain clearly and suggest exploring other categories.`;
};

/**
 * Standard Fast AI Chat Interaction
 */
const chat = async ({ message, conversationId, history = [], user = null }) => {
  const reqStart = Date.now();
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Message must be a non-empty string');
  }

  const convId = conversationId || 'conv_' + Date.now();

  // 1. Instant Intent Parsing & Normalization (< 1ms)
  const parsed = parseUserQuery(message);

  // 2. Direct Indexed MongoDB Lookup (3-10ms)
  const dbResult = await resolveDataFromDatabase(parsed, user);

  // 3. Generate synthesized response with Gemini in a single pass
  let responseText = '';
  if (genAI) {
    let lastError = null;
    const maxRetries = 1;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: GEMINI_MODEL,
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        const prompt = buildPromptContext(parsed, dbResult, message);
        const result = await model.generateContent(prompt);
        const res = await result.response;
        responseText = res.text();
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        if (isQuotaError(err)) {
          // If Gemini quota is exceeded, switch directly to deterministic instant response without waiting
          console.warn(`[Gemini Assistant] Quota limit reached (429), serving instant deterministic response.`);
          break;
        }
        if (isTransientGeminiError(err) && attempt < maxRetries) {
          const delayMs = 1000;
          console.warn(`[Gemini Assistant] Transient error (${err.message}), retrying in ${delayMs}ms...`);
          await sleep(delayMs);
          continue;
        }
        break;
      }
    }

    if (lastError || !responseText) {
      if (lastError && !isQuotaError(lastError)) {
        console.warn('[Gemini Fast Pipeline Fallback]:', lastError.message);
      }
      responseText = generateInstantResponse(parsed, dbResult);
    }
  } else {
    responseText = generateInstantResponse(parsed, dbResult);
  }

  const totalLatencyMs = Date.now() - reqStart;

  return {
    success: true,
    text: responseText,
    response: responseText,
    products: dbResult.products || [],
    conversationId: convId,
    meta: {
      intent: parsed.intent,
      dbDurationMs: dbResult.durationMs,
      totalLatencyMs,
    },
  };
};

/**
 * Streaming Chat Endpoint for Instant Interactive Token Delivery
 */
const chatStream = async ({ message, conversationId, user = null, onChunk, onComplete }) => {
  const reqStart = Date.now();
  const convId = conversationId || 'conv_' + Date.now();
  const parsed = parseUserQuery(message);
  const dbResult = await resolveDataFromDatabase(parsed, user);

  let accumulatedText = '';

  if (genAI) {
    let lastError = null;
    const maxRetries = 1;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: GEMINI_MODEL,
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        const prompt = buildPromptContext(parsed, dbResult, message);
        const resultStream = await model.generateContentStream(prompt);

        for await (const chunk of resultStream.stream) {
          const chunkText = chunk.text();
          accumulatedText += chunkText;
          if (onChunk) onChunk(chunkText);
        }
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        if (isQuotaError(err)) {
          console.warn(`[Gemini Stream] Quota limit reached (429), serving instant deterministic response.`);
          break;
        }
        if (isTransientGeminiError(err) && attempt < maxRetries && !accumulatedText) {
          const delayMs = 1000;
          console.warn(`[Gemini Stream] Transient error (${err.message}), retrying in ${delayMs}ms...`);
          await sleep(delayMs);
          continue;
        }
        break;
      }
    }

    if (lastError || !accumulatedText) {
      if (lastError && !isQuotaError(lastError)) {
        console.warn('[Gemini Stream Fallback]:', lastError.message);
      }
      accumulatedText = generateInstantResponse(parsed, dbResult);
      if (onChunk) onChunk(accumulatedText);
    }
  } else {
    accumulatedText = generateInstantResponse(parsed, dbResult);
    if (onChunk) onChunk(accumulatedText);
  }

  const totalLatencyMs = Date.now() - reqStart;
  const resultPayload = {
    success: true,
    text: accumulatedText,
    response: accumulatedText,
    products: dbResult.products || [],
    conversationId: convId,
    meta: {
      intent: parsed.intent,
      dbDurationMs: dbResult.durationMs,
      totalLatencyMs,
    },
  };

  if (onComplete) onComplete(resultPayload);
  return resultPayload;
};

/**
 * Deterministic Instant Response Builder (Under 5ms guaranteed luxury response)
 */
const generateInstantResponse = (parsed, dbResult) => {
  // 1. Greeting Intent
  if (parsed.intent === 'greeting') {
    return `Welcome to **MONOLITH Luxury Atelier**. I am your personal AI Stylist & Concierge.

Whether you are seeking bespoke styling advice, exploring our latest Men's or Women's collections, checking on an existing order, or curating pieces within your budget, I am at your service. How may I assist you today?`;
  }

  // 2. Order Tracking Intent
  if (dbResult.intent === 'order_tracking') {
    if (!dbResult.textData?.authenticated) {
      return 'To view your live order ledger and real-time tracking status, please sign in to your MONOLITH account. Once signed in, I will retrieve your active consignments and dispatch updates immediately.';
    }
    if (!dbResult.textData?.orders || dbResult.textData.orders.length === 0) {
      return dbResult.textData.message || 'No active orders were found in your MONOLITH account ledger.';
    }
    const latest = dbResult.textData.orders[0];
    const estDate = latest.estimatedDeliveryDate
      ? new Date(latest.estimatedDeliveryDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      : 'Estimated within 2-4 business days';

    return `Here is your live consignment status for **${latest.orderNumber}**:\n\n• **Order Status**: ${latest.orderStatus.toUpperCase()}\n• **Shipment**: ${latest.shipmentStatus.toUpperCase()}\n• **Carrier**: ${latest.carrier}\n• **AWB / Waybill**: ${latest.awbNumber}\n• **Estimated Delivery**: ${estDate}\n• **Total Amount**: ₹${latest.total.toLocaleString('en-IN')}\n\nYou can track this live at [Track Order](/track-order?orderNumber=${latest.orderNumber}).`;
  }

  // 3. Policy Intent
  if (dbResult.intent === 'policy') {
    const policy = dbResult.textData;
    if (policy && policy.title && policy.details) {
      return `### ${policy.title}\n\n${policy.details}`;
    }
    if (typeof policy === 'object') {
      return Object.values(policy)
        .map((p) => `### ${p.title}\n${p.details}`)
        .join('\n\n');
    }
  }

  // 4. Product Details Intent
  if (dbResult.products && dbResult.products.length === 1 && (parsed.intent === 'product_details' || parsed.target)) {
    const p = dbResult.products[0];
    const discountText = p.compareAtPrice > p.price ? ` *(Discounted from ₹${p.compareAtPrice.toLocaleString('en-IN')})*` : '';
    const stockText = p.stock > 0 ? `In Stock (${p.stock} units available)` : 'Currently Out of Stock';
    return `**${p.name}**\n\n• **Price**: ₹${p.price.toLocaleString('en-IN')}${discountText}\n• **Availability**: ${stockText}\n• **Category**: ${p.category}\n• **Material**: ${p.material || 'Luxury Fine Fabric'}\n• **Sizes Available**: ${(p.sizes || []).join(', ') || 'Standard Tailoring'}\n• **SKU**: ${p.sku}\n\n${p.description || 'Artisanal tailoring handcrafted from premium natural fibers.'}`;
  }

  // 5. Product Search with Products Found
  if (dbResult.products && dbResult.products.length > 0) {
    const dept = parsed.gender ? `${parsed.gender}'s ` : '';
    const cat = parsed.category ? parsed.category.toLowerCase() : 'pieces';
    const collectionDesc = `${dept}${cat}`.trim();

    if (parsed.newArrival) {
      return `Here are the latest new arrivals curated from our ${collectionDesc} collection:`;
    }
    if (parsed.onSale) {
      return `Here are the private sale pieces currently available from our ${collectionDesc} collection:`;
    }
    if (parsed.maxPrice) {
      return `Here are our handcrafted ${collectionDesc} available under ₹${parsed.maxPrice.toLocaleString('en-IN')}:`;
    }
    return `Here are our curated ${collectionDesc} from the live atelier catalog:`;
  }

  // 6. Product Search with ZERO Products Found (NEVER fallback to generic welcome)
  let itemDesc = '';
  if (parsed.gender) itemDesc += `${parsed.gender}'s `;
  if (parsed.category) itemDesc += parsed.category.toLowerCase();
  else if (parsed.keywords) itemDesc += `"${parsed.keywords}"`;
  else itemDesc += 'pieces';

  if (parsed.maxPrice) {
    itemDesc += ` under ₹${parsed.maxPrice.toLocaleString('en-IN')}`;
  }

  return `I couldn't find ${itemDesc.trim()} in our atelier catalog right now. Try increasing your budget or browse our latest new arrivals.`;
};

module.exports = {
  chat,
  chatStream,
  resolveDataFromDatabase,
  aiToolService,
};
