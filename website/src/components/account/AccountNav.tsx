import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccountNavProps {
  activePath?: string;
  title?: string;
}

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Orders', href: '/my-orders' },
  { label: 'Track Orders', href: '/track-order' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Saved Addresses', href: '/saved-addresses' },
  { label: 'Payment Methods', href: '/payment-methods' },
  { label: 'Account Settings', href: '/account-settings' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Help & Support', href: '/help-support' },
];

export const AccountNav: React.FC<AccountNavProps> = ({
  activePath,
  title = 'My Account',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPath = activePath || location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full">
      <h2 className="font-headline-md text-xl lg:text-2xl mb-4 lg:mb-6 text-primary">
        {title}
      </h2>
      <nav className="flex flex-col w-full border border-outline-variant bg-white divide-y divide-outline-variant/60 shadow-xs lg:border-0 lg:border-l lg:border-outline-variant lg:divide-y-0 lg:bg-transparent lg:shadow-none lg:gap-1">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href === '/my-orders' && currentPath.startsWith('/order'));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`min-h-[48px] px-4 py-3.5 sm:py-4 flex items-center justify-between font-label-caps text-xs uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-neutral-100 text-primary font-bold border-l-4 border-primary pl-3.5 lg:bg-transparent lg:border-l-2 lg:border-primary lg:-ml-[1px] lg:pl-6 lg:py-3'
                  : 'text-secondary hover:text-primary hover:bg-neutral-50/80 border-l-4 border-transparent pl-3.5 lg:border-l-2 lg:border-transparent lg:-ml-[1px] lg:pl-6 lg:py-3 lg:hover:bg-transparent'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight
                className={`w-4 h-4 lg:hidden transition-transform ${
                  isActive ? 'text-primary' : 'text-outline-variant'
                }`}
              />
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-[48px] px-4 py-3.5 sm:py-4 flex items-center justify-between font-label-caps text-xs uppercase tracking-wider text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer w-full text-left border-l-4 border-transparent pl-3.5 lg:pl-6 lg:py-3 lg:mt-6 lg:border-l-2 lg:border-transparent lg:-ml-[1px] lg:hover:bg-transparent"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </span>
          <ChevronRight className="w-4 h-4 lg:hidden text-red-300" />
        </button>
      </nav>
    </div>
  );
};

export default AccountNav;
