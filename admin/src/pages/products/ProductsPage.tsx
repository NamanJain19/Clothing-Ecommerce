import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Archive,
  Download,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialProducts, Product } from '../../data/products';
import { adminService } from '../../services/adminService';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl, getProductImage } from '../../utils/imageUtils';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchLiveProducts = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getProducts();
      if (data && data.products && data.products.length > 0) {
        const mapped: Product[] = data.products.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          sku: p.sku || 'N/A',
          category: typeof p.category === 'object' ? p.category?.name : (p.category || 'General'),
          collection: typeof p.collection === 'object' ? p.collection?.name : (p.collection || 'Monolith Archive'),
          brand: p.brand || 'MONOLITH',
          price: p.price,
          comparePrice: p.compareAtPrice,
          stock: p.stock ?? 15,
          status: p.stock === 0 ? 'Out of Stock' : (p.isActive ? 'Published' : 'Draft'),
          image: getProductImage(p),
          createdAt: p.createdAt || 'Just now',
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn('Failed to load products, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);


  // Filter & Search
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Stock: Low to High') return a.stock - b.stock;
    return 0; // Newest by default
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setActiveMenuId(null);
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'Published':
        return <AdminBadge variant="success">Published</AdminBadge>;
      case 'Out of Stock':
        return <AdminBadge variant="error">Out of Stock</AdminBadge>;
      case 'Draft':
        return <AdminBadge variant="neutral">Draft</AdminBadge>;
      case 'Archived':
        return <AdminBadge variant="warning">Archived</AdminBadge>;
      default:
        return <AdminBadge>{status}</AdminBadge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">Products</h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Manage luxury atelier inventory, pricing, and catalog assets.
            </p>
          </div>
          <AdminButton
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/admin/products/new')}
          >
            Add Product
          </AdminButton>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-primary text-on-primary flex items-center justify-between py-3 px-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                <span className="font-semibold text-xs bg-white/20 px-2.5 py-1 rounded-md">
                  {selectedIds.length} Selected
                </span>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-4 text-xs font-medium">
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1.5 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setProducts((prev) =>
                        prev.map((p) =>
                          selectedIds.includes(p.id) ? { ...p, status: 'Archived' } : p
                        )
                      );
                      setSelectedIds([]);
                    }}
                    className="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap items-center gap-space-md">
          <div className="flex-1 min-w-[240px]">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products by name or SKU..."
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-on-surface text-sm focus:border-primary outline-none cursor-pointer"
          >
            <option value="All">Category: All</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Horology">Horology</option>
            <option value="Leather Goods">Leather Goods</option>
            <option value="Fragrance">Fragrance</option>
            <option value="Tailoring">Tailoring</option>
            <option value="Footwear">Footwear</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-on-surface text-sm focus:border-primary outline-none cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Published">Published</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-on-surface text-sm focus:border-primary outline-none cursor-pointer"
          >
            <option value="Newest">Sort By: Newest</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Stock: Low to High">Stock: Low to High</option>
          </select>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 w-12">
                    <input
                      type="checkbox"
                      checked={
                        sortedProducts.length > 0 && selectedIds.length === sortedProducts.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Image
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Product Name
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    SKU
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Category
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Collection
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Price
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Stock
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="py-4 px-6 text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-surface-container-lowest transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                  >
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectRow(product.id)}
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-12 h-14 bg-surface-container rounded-md overflow-hidden border border-outline-variant flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt={product.name}
                          loading="lazy"
                          src={normalizeImageUrl(product.image)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-on-surface text-sm">{product.name}</div>
                      <div className="text-xs text-on-surface-variant">{product.brand}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-on-surface-variant">
                      {product.sku}
                    </td>
                    <td className="py-4 px-4 text-sm">{product.category}</td>
                    <td className="py-4 px-4 text-sm text-on-surface-variant">
                      {product.collection}
                    </td>
                    <td className="py-4 px-4 font-semibold text-sm font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.stock > 10
                              ? 'bg-emerald-500'
                              : product.stock > 0
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span>{product.stock} units</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(product.status)}</td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === product.id ? null : product.id)
                          }
                          className="p-1 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuId === product.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-outline-variant rounded-lg shadow-lg py-1 z-30">
                            <button
                              onClick={() => navigate(`/admin/products/${product.id}`)}
                              className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </button>
                            <button
                              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                              className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit Asset
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="w-full text-left px-4 py-2 text-xs text-error hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-on-surface-variant">
              Showing {Math.min(paginatedProducts.length, sortedProducts.length)} of{' '}
              {sortedProducts.length} items
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
