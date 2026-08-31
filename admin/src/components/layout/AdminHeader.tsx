import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, Settings, Shield, User, Check } from 'lucide-react';
import { initialNotifications } from '../../data/notifications';
import { storeSettingsService, StoreSettings } from '../../services/storeSettingsService';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search catalog, orders, customers...',
}) => {
  const navigate = useNavigate();
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(storeSettingsService.getSettings());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications.slice(0, 3));

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setStoreSettings(storeSettingsService.getSettings());
    };
    window.addEventListener('monolith_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('monolith_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/admin/products');
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 w-full flex justify-between items-center px-4 sm:px-6 bg-background/90 backdrop-blur-md border-b border-outline-variant shadow-xs h-[68px]">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center flex-1 bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <Search className="w-4 h-4 text-outline mr-2.5 flex-shrink-0" />
          <input
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-outline text-on-surface"
            placeholder={searchPlaceholder}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-surface-container transition-colors relative text-on-surface-variant cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-background" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-outline-variant rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-outline-variant max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/admin/notifications');
                    }}
                    className={`p-3.5 hover:bg-surface-container-low cursor-pointer transition-colors ${
                      n.unread ? 'bg-surface-container-lowest/70' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-primary">{n.title}</p>
                      <span className="text-[10px] text-outline flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-4 border-t border-outline-variant text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/admin/notifications');
                  }}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-7 w-[1px] bg-outline-variant mx-1" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity select-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-on-surface leading-tight">{storeSettings.adminName || 'Admin'}</p>
              <p className="text-[11px] text-on-surface-variant leading-tight">Store Administrator</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden border border-outline-variant flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Executive profile"
                src={storeSettings.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              />
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-outline-variant">
                <p className="text-xs font-bold text-primary">{storeSettings.adminName || 'Admin'}</p>
                <p className="text-[11px] text-on-surface-variant">{storeSettings.adminEmail || 'admin@monolith.luxury'}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-outline" /> General Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-outline" /> Security & 2FA
                </button>
              </div>

              <div className="pt-1 border-t border-outline-variant">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/admin/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-error hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
