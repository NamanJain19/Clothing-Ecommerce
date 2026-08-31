const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiToolService = require('./aiToolService');
const { parseUserQuery } = require('./aiQueryParser');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (err) {
    console.error('[Gemini Service] Initialization error:', err.message);
  }
}

// In-memory conversation session history (capped for speed and memory efficiency)
const sessionHistory = new Map();
const MAX_TURNS = 6;

const SYSTEM_INSTRUCTION = `You are the AI Stylist & Concierge for MONOLITH Luxury Atelier, an ultra-luxury haute couture and bespoke fashion house.
Your personality is elegant, refined, attentive, sophisticated, and deeply knowledgeable about luxury fashion, materials, styling, and order care.

RULES:
1. ALWAYS use the provided database context for product names, prices, availability, sizes, and orders.
2. NEVER invent fake products, fake prices, or fake tracking numbers.
3. Always format Indian currency as ₹ with commas (e.g. ₹3,999, ₹45,000).
4. You understand English, Hindi, and Hinglish naturally. Respond in a warm, sophisticated luxury tone that matches the customer's language.
5. If no products are found matching the criteria, clearly state that no matching pieces were found in the atelier.`;

/**
 * Execute real database search based on parsed intent
 */
const resolveDataFromDatabase = async (parsedQuery, user = null) => {
  const startTime = Date.now();
  let dbResult = { intent: parsedQuery.intent, products: [], textData: null };

  switch (parsedQuery.intent) {
    case 'order_tracking': {
      if (!user || !user._id) {
        dbResult.textData = {
          authenticated: false,
          message: 'Customer is not logged in. Please advise them to sign in to access live order tracking.',
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
        minPrice: parsedQuery.minPrice,
        maxPrice: parsedQuery.maxPrice,
        color: parsedQuery.color,
        size: parsedQuery.size,
        onSale: parsedQuery.onSale,
        newArrival: parsedQuery.newArrival,
        limit: 5,
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
 * Format minimal, high-density context for Gemini to eliminate unnecessary tokens & latency
 */
const buildPromptContext = (parsedQuery, dbResult, userMessage) => {
  let contextSnippet = '';

  if (dbResult.intent === 'order_tracking') {
    if (!dbResult.textData?.authenticated) {
      contextSnippet = `[USER IS NOT LOGGED IN]: Tell the user gracefully to sign in to view their orders and tracking ledger.`;
    } else if (!dbResult.textData.orders || dbResult.textData.orders.length === 0) {
      contextSnippet = `[NO ORDERS FOUND]: ${dbResult.textData.message || 'No orders found in ledger.'}`;
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
    contextSnippet = `[LIVE DATABASE]: No matching active products found for this search.`;
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
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const prompt = buildPromptContext(parsed, dbResult, message);
      const result = await model.generateContent(prompt);
      const res = await result.response;
      responseText = res.text();
    } catch (err) {
      console.warn('[Gemini Fast Pipeline Fallback]:', err.message);
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
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const prompt = buildPromptContext(parsed, dbResult, message);
      const resultStream = await model.generateContentStream(prompt);

      for await (const chunk of resultStream.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        if (onChunk) onChunk(chunkText);
      }
    } catch (err) {
      console.warn('[Gemini Stream Fallback]:', err.message);
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
 * Deterministic Instant Response Builder (Under 5ms guaranteed response)
 */
const generateInstantResponse = (parsed, dbResult) => {
  if (dbResult.intent === 'order_tracking') {
    if (!dbResult.textData?.authenticated) {
      return 'To view your live order ledger and real-time Shiprocket tracking, please sign in to your MONOLITH account.';
    }
    if (!dbResult.textData?.orders || dbResult.textData.orders.length === 0) {
      return dbResult.textData.message || 'No active orders found in your account ledger.';
    }
    const latest = dbResult.textData.orders[0];
    const estDate = latest.estimatedDeliveryDate
      ? new Date(latest.estimatedDeliveryDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      : 'Estimated within 2-4 business days';

    return `Here is your live consignment status for **${latest.orderNumber}**:\n\n• **Order Status**: ${latest.orderStatus.toUpperCase()}\n• **Shipment**: ${latest.shipmentStatus.toUpperCase()}\n• **Carrier**: ${latest.carrier}\n• **AWB / Waybill**: ${latest.awbNumber}\n• **Estimated Delivery**: ${estDate}\n• **Total Amount**: ₹${latest.total.toLocaleString('en-IN')}\n\nYou can view full live tracking at [Track Order](/track-order?orderNumber=${latest.orderNumber}).`;
  }

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

  if (dbResult.products && dbResult.products.length > 0) {
    if (dbResult.products.length === 1 && (parsed.intent === 'product_details' || parsed.target)) {
      const p = dbResult.products[0];
      const discountText = p.compareAtPrice > p.price ? ` *(Discounted from ₹${p.compareAtPrice.toLocaleString('en-IN')})*` : '';
      const stockText = p.stock > 0 ? `In Stock (${p.stock} units available)` : 'Currently Out of Stock';
      return `**${p.name}**\n\n• **Price**: ₹${p.price.toLocaleString('en-IN')}${discountText}\n• **Availability**: ${stockText}\n• **Category**: ${p.category}\n• **Material**: ${p.material || 'Luxury Fine Fabric'}\n• **Sizes Available**: ${(p.sizes || []).join(', ') || 'Standard Tailoring'}\n• **SKU**: ${p.sku}\n\n${p.description || 'Artisanal tailoring handcrafted from premium natural fibers.'}`;
    }
    return `Here are our bespoke handcrafted pieces curated from the live atelier catalogue:`;
  }

  return `I could not find any active pieces matching your exact query. Would you like to explore our New Arrivals or browse specific collections like Outerwear, Tailored Shirts, or Private Sale?`;
};

module.exports = {
  chat,
  chatStream,
  resolveDataFromDatabase,
  aiToolService,
};

