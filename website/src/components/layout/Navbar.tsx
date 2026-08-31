import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, ChevronDown, Menu, X, ScanSearch } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { VisualSearchModal } from '../common/VisualSearchModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);

  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only the root Homepage has the full-bleed dark hero banner at scroll top
  const isHeroPage = location.pathname === '/';
  const isTransparent = isHeroPage && !isScrolled;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Explicit, deterministic theme-aware styling classes
  let navBgClass = '';
  let logoClass = '';
  let iconClass = '';
  let badgeClass = '';
  let lensBtnClass = '';
  let dropdownBgClass = '';
  let dropdownLinkClass = '';
  let mobileDrawerClass = '';

  if (isTransparent) {
    // 1. Transparent over Dark Hero Banner
    navBgClass = 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white border-b border-white/10 drop-shadow-sm';
    logoClass = 'text-white drop-shadow';
    iconClass = 'text-white hover:text-white/80';
    badgeClass = 'bg-white text-black';
    lensBtnClass = 'text-amber-300 hover:text-white bg-white/10';
  } else if (!isDark) {
    // 2. Solid LIGHT Mode Navbar
    navBgClass = 'bg-white/95 backdrop-blur-md text-neutral-900 border-b border-neutral-200/80 shadow-xs';
    logoClass = 'text-neutral-950';
    iconClass = 'text-neutral-800 hover:text-neutral-950';
    badgeClass = 'bg-neutral-950 text-white';
    lensBtnClass = 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200';
    dropdownBgClass = 'bg-white border-neutral-200 shadow-xl';
    dropdownLinkClass = 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100';
    mobileDrawerClass = 'bg-white text-neutral-900 border-b border-neutral-200 shadow-xl';
  } else {
    // 3. Solid DARK Mode Navbar
    navBgClass = 'bg-[#0e0f11]/95 backdrop-blur-md text-white border-b border-neutral-800/80 shadow-sm';
    logoClass = 'text-white';
    iconClass = 'text-neutral-200 hover:text-white';
    badgeClass = 'bg-white text-black';
    lensBtnClass = 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20';
    dropdownBgClass = 'bg-[#151618] border-neutral-800 shadow-xl';
    dropdownLinkClass = 'text-neutral-400 hover:text-white hover:bg-neutral-800';
    mobileDrawerClass = 'bg-[#121314] text-white border-b border-neutral-800 shadow-xl';
  }

  const getNavLinkClass = (path: string) => {
    const active = isActive(path);
    if (isTransparent) {
      return active
        ? 'text-white border-b-2 border-white font-bold'
        : 'text-white/85 hover:text-white font-medium';
    }
    if (!isDark) {
      return active
        ? 'text-neutral-950 border-b-2 border-neutral-950 font-bold'
        : 'text-neutral-600 hover:text-neutral-950 font-medium';
    }
    return active
      ? 'text-white border-b-2 border-white font-bold'
      : 'text-neutral-400 hover:text-white font-medium';
  };

  const getMobileLinkClass = (path: string) => {
    const active = isActive(path);
    if (!isDark) {
      return active
        ? 'text-neutral-950 border-b border-neutral-950 font-bold self-start pb-1'
        : 'text-neutral-600 hover:text-neutral-950 font-medium pb-1';
    }
    return active
      ? 'text-white border-b border-white font-bold self-start pb-1'
      : 'text-neutral-400 hover:text-white font-medium pb-1';
  };

  return (
    <>
      <nav
        id="top-nav"
        className={`fixed top-0 w-full z-40 transition-all duration-300 ease-in-out ${navBgClass}`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-unit max-w-container-max mx-auto h-20">
          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 focus:outline-none cursor-pointer transition-colors ${iconClass}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`font-display-lg text-2xl tracking-[0.3em] uppercase select-none cursor-pointer transition-colors font-bold ${logoClass}`}
            >
              MONOLITH
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest pb-1 transition-colors ${getNavLinkClass('/')}`}
              to="/"
            >
              Home
            </Link>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest pb-1 transition-colors ${getNavLinkClass('/collections')}`}
              to="/collections"
            >
              Collections
            </Link>
            <div className="group relative">
              <Link
                to="/categories"
                className={`font-label-caps text-label-caps uppercase tracking-widest pb-1 flex items-center gap-1 cursor-pointer transition-colors ${getNavLinkClass('/categories')}`}
              >
                Categories
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
              </Link>
              <div
                className={`absolute top-full left-0 mt-2 w-48 border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 rounded-xl ${
                  isTransparent || !isDark
                    ? 'bg-white border-neutral-200 shadow-xl'
                    : 'bg-[#151618] border-neutral-800 shadow-xl'
                }`}
              >
                <Link
                  className={`block px-6 py-2.5 font-label-caps text-[11px] uppercase tracking-widest transition-colors ${
                    isTransparent || !isDark
                      ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  to="/men"
                >
                  Men
                </Link>
                <Link
                  className={`block px-6 py-2.5 font-label-caps text-[11px] uppercase tracking-widest transition-colors ${
                    isTransparent || !isDark
                      ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  to="/women"
                >
                  Women
                </Link>
                <Link
                  className={`block px-6 py-2.5 font-label-caps text-[11px] uppercase tracking-widest transition-colors ${
                    isTransparent || !isDark
                      ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  to="/kids"
                >
                  Kids
                </Link>
                <Link
                  className={`block px-6 py-2.5 font-label-caps text-[11px] uppercase tracking-widest transition-colors ${
                    isTransparent || !isDark
                      ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  to="/accessories"
                >
                  Accessories
                </Link>
              </div>
            </div>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest pb-1 transition-colors ${getNavLinkClass('/new-arrivals')}`}
              to="/new-arrivals"
            >
              New Arrivals
            </Link>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest pb-1 transition-colors ${getNavLinkClass('/sale')}`}
              to="/sale"
            >
              Sale
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            {/* Amazon-Style AI Lens Button */}
            <button
              onClick={() => setVisualSearchOpen(true)}
              aria-label="AI Visual Lens"
              title="AI Lens — Search Atelier by Photo"
              className={`transition-colors cursor-pointer p-1.5 rounded-full hover:scale-110 duration-200 flex items-center gap-1 ${lensBtnClass}`}
            >
              <ScanSearch className="w-5 h-5" />
            </button>

            <Link
              to="/search"
              aria-label="Search"
              className={`transition-colors cursor-pointer ${iconClass}`}
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className={`transition-colors cursor-pointer relative ${iconClass}`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold ${badgeClass}`}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Shopping Bag"
              className={`transition-colors cursor-pointer relative ${iconClass}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold ${badgeClass}`}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              aria-label={isAuthenticated ? 'My Account' : 'Sign In'}
              className={`transition-colors cursor-pointer flex items-center ${iconClass}`}
              title={isAuthenticated ? (user?.fullName || 'My Account') : 'Sign In'}
            >
              {isAuthenticated ? (
                user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || 'Account Avatar'}
                    className="w-7 h-7 rounded-full object-cover border border-neutral-300 dark:border-neutral-700 shadow-xs"
                  />
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${badgeClass}`}>
                    {user?.firstName?.[0] || 'U'}
                  </div>
                )
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden px-margin-mobile py-6 flex flex-col space-y-4 ${mobileDrawerClass}`}>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-300 ${getMobileLinkClass('/')}`}
              to="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-300 ${getMobileLinkClass('/collections')}`}
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-300 ${getMobileLinkClass('/categories')}`}
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-300 ${getMobileLinkClass('/new-arrivals')}`}
              to="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              className={`font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-300 ${getMobileLinkClass('/sale')}`}
              to="/sale"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sale
            </Link>
          </div>
        )}
      </nav>

      {/* AI Visual Lens Modal */}
      <VisualSearchModal isOpen={visualSearchOpen} onClose={() => setVisualSearchOpen(false)} />
    </>
  );
};

export default Navbar;
