import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Bot,
  Heart,
  ExternalLink,
  Loader2,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getToken } from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3011/api';

export interface StructuredProduct {
  id: string;
  name: string;
  slug?: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  images?: string[];
  thumbnail?: string;
  category?: string;
  stock?: number;
  inStock?: boolean;
  productUrl?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  products?: StructuredProduct[];
  timestamp: string;
  isStreaming?: boolean;
}

export const AIStylistWidget: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => 'conv_' + Date.now());
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Namaste & welcome to MONOLITH Luxury Atelier. I am your live AI Stylist & Concierge powered by Gemini.\n\nAsk me about men\'s or women\'s collections, price checks (e.g. "3000 ke andar mens shirts"), bespoke sizing, or your live order tracking.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || inputMsg;
    if (!text.trim() || isThinking) return;

    const userMsgId = `usr-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    const userMessage: Message = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message
    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInputMsg('');
    setIsThinking(true);

    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // 1. Attempt Real Streaming via SSE
      const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          conversationId,
        }),
      });

      if (response.ok && response.body) {
        // Create initial placeholder for streaming AI message
        const initialAiMsg: Message = {
          id: aiMsgId,
          sender: 'ai',
          text: '',
          products: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        };
        setMessages((prev) => [...prev, initialAiMsg]);
        setIsThinking(false);

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let finalProducts: StructuredProduct[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawChunk = decoder.decode(value, { stream: true });
          const lines = rawChunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace('data: ', '').trim();
              if (jsonStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.type === 'chunk' && parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsgId ? { ...m, text: accumulatedText, isStreaming: true } : m
                    )
                  );
                } else if (parsed.type === 'complete') {
                  accumulatedText = parsed.text || accumulatedText;
                  finalProducts = parsed.products || [];
                  if (parsed.conversationId) setConversationId(parsed.conversationId);
                }
              } catch {
                // partial chunk, ignore
              }
            }
          }
        }

        // Finalize streaming message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: accumulatedText || 'Here are our bespoke selections for you:',
                  products: finalProducts,
                  isStreaming: false,
                }
              : m
          )
        );
        return;
      }

      // 2. Fallback to standard fast JSON chat
      const fastRes = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          conversationId,
        }),
      });

      const data = await fastRes.json();
      if (fastRes.ok && data.success) {
        const aiMessage: Message = {
          id: aiMsgId,
          sender: 'ai',
          text: data.text || data.response || 'I have curated these pieces for you.',
          products: data.products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        if (data.conversationId) setConversationId(data.conversationId);
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'AI request could not be processed');
      }
    } catch (err: any) {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I encountered a momentary connection notice: ${err.message}. Please try asking again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, prod: StructuredProduct) => {
    e.stopPropagation();
    addToCart({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.thumbnail || prod.images?.[0] || '',
      quantity: 1,
      size: 'M',
      color: 'Default',
    });
    setAddedItemIds((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [prod.id]: false }));
    }, 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent, prod: StructuredProduct) => {
    e.stopPropagation();
    toggleWishlist({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.thumbnail || prod.images?.[0] || '',
      category: prod.category || 'Luxury Fashion',
    });
  };

  /**
   * CRITICAL BUG 3 FIX:
   * Always navigates to canonical working route `/product/:id`
   * Never generates `/products/...` or fake slugs
   */
  const navigateToProduct = (prod: StructuredProduct) => {
    setIsOpen(false);
    navigate(`/product/${encodeURIComponent(prod.id)}`);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-neutral-900 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-amber-400 dark:text-black p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group cursor-pointer border border-amber-400/30"
          aria-label="Open AI Stylist"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold font-sans uppercase tracking-wider hidden sm:inline-block pr-1">
            AI Stylist
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] bg-white dark:bg-[#131416] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2">
                  MONOLITH AI Stylist
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-neutral-400">Live Database Gemini Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestion Chips (Supporting Indian & Hinglish shortcuts) */}
          <div className="px-4 py-2.5 bg-neutral-50 dark:bg-[#17181a] border-b border-neutral-200 dark:border-neutral-800 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {[
              'mens ke products dikhao',
              '3000 ke andar shirts',
              'women ke dresses',
              'men ke new arrivals',
              'Where is my order?',
              '14-Day Return Policy',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-semibold bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer hover:border-amber-400 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-400/30 self-start mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-neutral-900 text-white dark:bg-amber-400 dark:text-black rounded-tr-xs'
                      : 'bg-neutral-100 dark:bg-[#1c1d20] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">
                    {m.text}
                    {m.isStreaming && <span className="inline-block w-1.5 h-3 bg-amber-500 ml-1 animate-pulse" />}
                  </p>

                  {/* Structured Product Cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {m.products.map((prod) => {
                        const img = prod.thumbnail || prod.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b';
                        const inWish = isInWishlist(prod.id);
                        const isAdded = addedItemIds[prod.id];

                        return (
                          <div
                            key={prod.id}
                            onClick={() => navigateToProduct(prod)}
                            className="flex items-center gap-3 p-2 bg-white dark:bg-[#121314] rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-amber-400 transition-all cursor-pointer group shadow-xs"
                          >
                            <img
                              src={img}
                              alt={prod.name}
                              className="w-14 h-16 object-cover rounded-lg shrink-0 border border-neutral-100 dark:border-neutral-800"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs truncate group-hover:text-amber-500 transition-colors">
                                {prod.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs text-amber-500 font-bold">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                                {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                                  <span className="font-mono text-[10px] text-neutral-400 line-through">
                                    ₹{prod.compareAtPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToCart(e, prod)}
                                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800'
                                  }`}
                                >
                                  {isAdded ? <Check className="w-2.5 h-2.5" /> : <ShoppingBag className="w-2.5 h-2.5" />}
                                  {isAdded ? 'Added' : 'Add to Bag'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleWishlist(e, prod)}
                                  className={`p-1 rounded border transition-colors ${
                                    inWish
                                      ? 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30'
                                      : 'text-neutral-400 border-neutral-200 hover:text-red-500'
                                  }`}
                                  title="Wishlist"
                                >
                                  <Heart className={`w-3 h-3 ${inWish ? 'fill-red-500' : ''}`} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToProduct(prod);
                                  }}
                                  className="text-[10px] text-neutral-500 hover:text-primary flex items-center gap-0.5 ml-auto pr-1"
                                >
                                  View <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-[9px] opacity-40 block text-right">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-2.5 items-center text-neutral-500 text-xs pl-2">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Consulting live atelier catalogue...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-50 dark:bg-[#17181a] border-t border-neutral-200 dark:border-neutral-800 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask: 'mens ke black shirts', '3000 ke andar', order status..."
              className="flex-1 bg-white dark:bg-[#121314] text-xs p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:border-amber-400 focus:outline-none"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || isThinking}
              className="bg-neutral-900 dark:bg-amber-400 hover:bg-black dark:hover:bg-amber-300 text-white dark:text-black p-3 rounded-2xl transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIStylistWidget;
