import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface py-12 md:py-16 border-t border-outline/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-4">
            <Link to="/" className="font-display-lg text-lg tracking-[0.25em] uppercase block mb-4 select-none text-primary">
              Monolith
            </Link>
            <p className="font-body-md text-secondary text-xs leading-relaxed max-w-xs opacity-75">
              Curating the finest materials to create a wardrobe of architectural precision and timeless elegance for the modern individual.
            </p>
          </div>

          {/* Boutique Navigation */}
          <div className="md:col-span-2">
            <h6 className="font-label-caps text-[11px] uppercase tracking-[0.2em] mb-4 text-primary font-semibold">
              Boutique
            </h6>
            <ul className="space-y-2.5">
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/new-arrivals">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/collections">
                  Collections
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/accessories">
                  Accessories
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/categories">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="md:col-span-3">
            <h6 className="font-label-caps text-[11px] uppercase tracking-[0.2em] mb-4 text-primary font-semibold">
              Client Care
            </h6>
            <ul className="space-y-2.5">
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/shipping-policy">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/faq">
                  Size Guide &amp; FAQ
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/contact-us">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="font-body-md text-[13px] text-secondary hover:text-primary transition-colors" to="/about-us">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Journal & Copyright */}
          <div className="md:col-span-3">
            <h6 className="font-label-caps text-[11px] uppercase tracking-[0.2em] mb-4 text-primary font-semibold">
              Social Journal
            </h6>
            <div className="flex space-x-6 mb-8">
              <a className="text-[13px] font-body-md text-secondary hover:text-primary transition-colors" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a className="text-[13px] font-body-md text-secondary hover:text-primary transition-colors" href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                Pinterest
              </a>
              <a className="text-[13px] font-body-md text-secondary hover:text-primary transition-colors" href="https://vogue.com" target="_blank" rel="noopener noreferrer">
                Vogue
              </a>
            </div>
            <div className="pt-4 border-t border-outline/10 space-y-1">
              <p className="font-label-caps text-[9px] uppercase tracking-widest text-outline">
                © 2026 MONOLITH LUXURY.
              </p>
              <p className="font-label-caps text-[9px] uppercase tracking-widest text-outline">
                ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
