import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RotateCw,
  Edit,
  Building2,
  Package,
  Layers,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialInventory, InventoryItem } from '../../data/inventory';
import { adminService } from '../../services/adminService';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [restockingItem, setRestockingItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState('15');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchLiveInventory = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getProducts();
      if (res && res.products && res.products.length > 0) {
        const mapped: InventoryItem[] = res.products.map((p: any) => {
          const avail = p.stock ?? 15;
          const safety = 5;
          let st: InventoryItem['status'] = 'In Stock';
          if (avail === 0) st = 'Out of Stock';
          else if (avail <= 2) st = 'Critical';
          else if (avail <= safety) st = 'Low Stock';

          return {
            id: p._id || p.id,
            productName: p.name,
            sku: p.sku || `MON-${p._id?.slice(-5)}`,
            totalStock: avail + 5,
            availableStock: avail,
            reservedStock: 2,
            safetyThreshold: safety,
            location: 'Central Vault / Milan',
            status: st,
            lastAuditDate: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
          };
        });
        setInventory(mapped);
      }
    } catch (err) {
      console.warn('Failed to load inventory from live backend, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveInventory();
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'In Stock':
        return <AdminBadge variant="success">In Stock</AdminBadge>;
      case 'Low Stock':
        return <AdminBadge variant="warning">Low Stock</AdminBadge>;
      case 'Critical':
        return <AdminBadge variant="error">Critical Stock</AdminBadge>;
      case 'Out of Stock':
        return <AdminBadge variant="neutral">Out of Stock</AdminBadge>;
      default:
        return <AdminBadge>{status}</AdminBadge>;
    }
  };

  const handleRestockSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!restockingItem) return;
    const addedUnits = parseInt(restockAmount, 10) || 0;
    const newAvailable = restockingItem.availableStock + addedUnits;

    try {
      await adminService.updateProduct(restockingItem.id, {
        stock: newAvailable,
      });
    } catch (err) {
      console.warn('Failed to update live stock via API:', err);
    }

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === restockingItem.id) {
          return {
            ...item,
            availableStock: newAvailable,
            totalStock: (item.totalStock ?? item.availableStock) + addedUnits,
            status:
              newAvailable > item.safetyThreshold
                ? 'In Stock'
                : newAvailable > 0
                ? 'Low Stock'
                : 'Out of Stock',
          };
        }
        return item;
      })
    );
    setRestockingItem(null);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Inventory & Vault Stock Master
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Real-time vault stock audits synchronized with active storefront catalog and order allocations.
            </p>
          </div>
          <AdminButton
            variant="outline"
            leftIcon={<RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={fetchLiveInventory}
          >
            Audit Stock Sync
          </AdminButton>
        </div>

        {/* Filters */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[260px]">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by product name, SKU, or vault location..."
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface outline-none cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Monitoring {filteredInventory.length} SKU assets
          </span>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Garment / Complication
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    SKU Code
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Available Units
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Reserved
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Safety Min.
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Health Status
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Restock Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-sm text-primary">{item.productName}</p>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {item.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant font-bold">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-primary font-mono">
                      {item.availableStock} units
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface font-mono">
                      {item.reservedStock}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface-variant font-mono">
                      {item.safetyThreshold}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setRestockingItem(item);
                          setRestockAmount('15');
                        }}
                        className="px-3 py-1.5 bg-surface-container hover:bg-primary hover:text-white text-xs font-semibold rounded-lg border border-outline-variant transition-colors cursor-pointer"
                      >
                        + Restock Units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-on-surface-variant">
              Showing {Math.min(paginatedInventory.length, filteredInventory.length)} of{' '}
              {filteredInventory.length} assets
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInventory.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Restock Modal */}
      {restockingItem && (
        <AdminModal
          isOpen={Boolean(restockingItem)}
          onClose={() => setRestockingItem(null)}
          title={`Restock ${restockingItem.productName}`}
          description={`SKU: ${restockingItem.sku} • Current Available: ${restockingItem.availableStock} units`}
          footer={
            <>
              <AdminButton variant="outline" onClick={() => setRestockingItem(null)}>
                Cancel
              </AdminButton>
              <AdminButton onClick={handleRestockSubmit}>Commit Inbound Stock</AdminButton>
            </>
          }
        >
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <AdminInput
              label="Additional Stock Units to Add"
              type="number"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              required
            />
            <div className="p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant">
              New Projected Available Stock:{' '}
              <strong className="text-primary font-bold">
                {restockingItem.availableStock + (parseInt(restockAmount, 10) || 0)} units
              </strong>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default InventoryPage;
