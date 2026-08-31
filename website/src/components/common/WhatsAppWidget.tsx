import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { storeSettingsService, StoreSettings } from '../../services/storeSettingsService';

export const WhatsAppWidget: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(storeSettingsService.getSettings());
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(storeSettingsService.getSettings());
    };
    window.addEventListener('monolith_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('monolith_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!settings.whatsappEnabled) return null;

  const handleOpenWhatsApp = (text?: string) => {
    const message = text || customMsg || settings.whatsappWelcomeMessage;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Luxury Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-neutral-900 rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">{settings.whatsappAgentName}</h4>
                <span className="text-[10px] text-emerald-400 font-medium">Online • Instant VIP Response</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-neutral-50 space-y-3 max-h-[260px] overflow-y-auto">
            <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-xs text-xs text-neutral-800 space-y-1.5">
              <p className="font-medium">
                👋 Welcome to <strong>{settings.storeName}</strong>.
              </p>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                How can our atelier concierge assist you with sizes, orders, or private styling today?
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Quick Inquiries</p>
              <button
                onClick={() => handleOpenWhatsApp('Hi, I need help with sizing for an item.')}
                className="w-full text-left text-xs bg-white hover:bg-neutral-100 border border-neutral-200 p-2 rounded-lg text-neutral-800 transition-colors cursor-pointer"
              >
                📏 Inquire about sizing & measurements
              </button>
              <button
                onClick={() => handleOpenWhatsApp('Hello, I would like to track my order delivery.')}
                className="w-full text-left text-xs bg-white hover:bg-neutral-100 border border-neutral-200 p-2 rounded-lg text-neutral-800 transition-colors cursor-pointer"
              >
                🚚 Track an existing order consignment
              </button>
              <button
                onClick={() => handleOpenWhatsApp('Hi, I want to inquire about custom bespoke tailoring.')}
                className="w-full text-left text-xs bg-white hover:bg-neutral-100 border border-neutral-200 p-2 rounded-lg text-neutral-800 transition-colors cursor-pointer"
              >
                💎 Book a Bespoke Atelier Consultation
              </button>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenWhatsApp()}
              placeholder="Type your WhatsApp message..."
              className="flex-1 text-xs bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-neutral-900"
            />
            <button
              onClick={() => handleOpenWhatsApp()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">WhatsApp Concierge</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
      </button>
    </div>
  );
};

export default WhatsAppWidget;
