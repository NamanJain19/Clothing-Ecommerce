import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Warehouse,
  TicketPercent,
  Star,
  BarChart3,
  Globe,
  Image,
  Truck,
  CreditCard,
  Bell,
  Settings,
  RotateCcw,
  Tag,
  Ruler,
  Gift,
  FileSpreadsheet,
  Compass,
  FileText,
  Mail,
  LogOut,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem('admin_sidebar_scroll');
    if (savedScroll && navRef.current) {
      navRef.current.scrollTop = Number(savedScroll);
    }
  }, [location.pathname]);

  const handleScroll = () => {
    if (navRef.current) {
      sessionStorage.setItem('admin_sidebar_scroll', String(navRef.current.scrollTop));
    }
  };

  const navSections = [
    {
      title: 'Core Operations',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: FolderTree },
        { name: 'Collections', path: '/admin/collections', icon: Boxes },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Inventory', path: '/admin/inventory', icon: Warehouse },
      ],
    },
    {
      title: 'Marketing & Sales',
      items: [
        { name: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
        { name: 'Reviews', path: '/admin/reviews', icon: Star },
        { name: 'Newsletter Audience', path: '/admin/newsletter', icon: Mail },
        { name: 'Gift Cards', path: '/admin/gift-cards', icon: Gift },
        { name: 'Brands', path: '/admin/brands', icon: Tag },
        { name: 'Size Guide', path: '/admin/size-guide', icon: Ruler },
      ],
    },
    {
      title: 'Storefront & CMS',
      items: [
        { name: 'Website Content', path: '/admin/website-content', icon: Globe },
        { name: 'Banners', path: '/admin/banners', icon: Image },
        { name: 'Pages', path: '/admin/pages', icon: FileText },
        { name: 'Navigation', path: '/admin/navigation', icon: Compass },
        { name: 'Email Templates', path: '/admin/email-templates', icon: Mail },
      ],
    },
    {
      title: 'Logistics & Finance',
      items: [
        { name: 'Shipping', path: '/admin/shipping', icon: Truck },
        { name: 'Payments', path: '/admin/payments', icon: CreditCard },
        { name: 'Returns & Exchanges', path: '/admin/returns', icon: RotateCcw },
      ],
    },
    {
      title: 'Analytics & Config',
      items: [
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] bg-surface border-r border-outline-variant flex flex-col py-5 px-3.5 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-4 px-2.5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary">MONOLITH</h1>
            <p className="font-caption text-on-surface-variant text-[11px] font-medium tracking-wide">
              LUXURY OPERATIONS
            </p>
          </div>
          <button
            className="lg:hidden p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
            onClick={onCloseMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav
          ref={navRef}
          onScroll={handleScroll}
          className="flex-1 space-y-4 overflow-y-auto pr-1 select-none scrollbar-thin"
        >
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-outline'}`} />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="mt-3 pt-3 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 px-3 text-error hover:bg-error-container/60 transition-colors rounded-lg text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout System</span>
          </button>
        </div>
      </aside>
    </>
  );
};
