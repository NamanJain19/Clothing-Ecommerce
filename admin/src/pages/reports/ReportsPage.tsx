import React, { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, ArrowUpRight, CheckCircle2, Shield, FileText, Loader2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { adminService } from '../../services/adminService';

interface ReportConfig {
  id: string;
  title: string;
  category: string;
  format: string;
  description: string;
  endpoint: 'sales' | 'orders' | 'customers' | 'inventory' | 'returns';
}

const AVAILABLE_REPORTS: ReportConfig[] = [
  {
    id: 'REP-SALES',
    title: 'Sales Ledger & Revenue Statement',
    category: 'Financial / Sales',
    format: 'CSV Document',
    description: 'Breakdown of net revenue, subtotals, GST taxes, and discounts from MongoDB Atlas.',
    endpoint: 'sales',
  },
  {
    id: 'REP-ORDERS',
    title: 'Order Status & Payment Gateway Breakdown',
    category: 'Logistics / Orders',
    format: 'CSV Document',
    description: 'Order pipeline volumes, fulfillment states, and payment gateway collections.',
    endpoint: 'orders',
  },
  {
    id: 'REP-CUSTOMERS',
    title: 'Client Accounts & VIP Spending Report',
    category: 'Clients / CRM',
    format: 'CSV Document',
    description: 'Registered customer accounts, orders placed, and lifetime spending values.',
    endpoint: 'customers',
  },
  {
    id: 'REP-INVENTORY',
    title: 'Inventory Valuation & Live Stock Audit',
    category: 'Inventory / Vault',
    format: 'CSV Document',
    description: 'Total active SKUs, current in-stock pieces, out-of-stock items, and category allocations.',
    endpoint: 'inventory',
  },
  {
    id: 'REP-RETURNS',
    title: 'Returns, Alterations & Exchanges Ledger',
    category: 'Customer Care / Returns',
    format: 'CSV Document',
    description: 'Client return requests, approved refunds, alterations, and reason statements.',
    endpoint: 'returns',
  },
];

export const ReportsPage: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleDownload = async (rep: ReportConfig) => {
    setDownloadingId(rep.id);
    setStatusMessage(null);

    try {
      let csvRows: string[][] = [];

      if (rep.endpoint === 'sales') {
        const res = await adminService.getSalesReport({ period: 'daily' });
        const summary = res.data?.summary || {};
        const breakdown = res.data?.breakdown || [];

        csvRows.push(['MONOLITH LUXURY - SALES LEDGER REPORT']);
        csvRows.push(['Export Timestamp', new Date().toISOString()]);
        csvRows.push(['Total Net Revenue (INR)', String(summary.netRevenue || 0)]);
        csvRows.push(['Total Orders Count', String(summary.totalOrders || 0)]);
        csvRows.push(['Total Tax Collected (INR)', String(summary.totalTax || 0)]);
        csvRows.push(['Total Discounts Applied (INR)', String(summary.totalDiscount || 0)]);
        csvRows.push([]);
        csvRows.push(['Date', 'Orders Count', 'Subtotal', 'Tax', 'Discounts', 'Net Revenue']);
        breakdown.forEach((b: any) => {
          csvRows.push([
            b._id || '',
            String(b.ordersCount || 0),
            String(b.subtotal || 0),
            String(b.tax || 0),
            String(b.discount || 0),
            String(b.totalRevenue || 0),
          ]);
        });
      } else if (rep.endpoint === 'orders') {
        const res = await adminService.getOrdersReport();
        const statusStats = res.data?.statusStats || [];
        const paymentStats = res.data?.paymentStats || [];

        csvRows.push(['MONOLITH LUXURY - ORDERS REPORT']);
        csvRows.push(['Export Timestamp', new Date().toISOString()]);
        csvRows.push([]);
        csvRows.push(['--- ORDER STATUS BREAKDOWN ---']);
        csvRows.push(['Status', 'Order Count', 'Total Amount (INR)']);
        statusStats.forEach((s: any) => {
          csvRows.push([s._id || 'Standard', String(s.count || 0), String(s.totalAmount || 0)]);
        });
        csvRows.push([]);
        csvRows.push(['--- PAYMENT METHOD BREAKDOWN ---']);
        csvRows.push(['Payment Method', 'Transactions', 'Total Amount (INR)']);
        paymentStats.forEach((p: any) => {
          csvRows.push([p._id || 'Prepaid', String(p.count || 0), String(p.totalAmount || 0)]);
        });
      } else if (rep.endpoint === 'customers') {
        const res = await adminService.getCustomersReport();
        const summary = res.data?.summary || {};
        const topCustomers = res.data?.topCustomers || [];

        csvRows.push(['MONOLITH LUXURY - CLIENTS AUDIT REPORT']);
        csvRows.push(['Export Timestamp', new Date().toISOString()]);
        csvRows.push(['Total Customers Registered', String(summary.totalCustomers || 0)]);
        csvRows.push(['New Clients (Last 30 Days)', String(summary.newCustomersLast30Days || 0)]);
        csvRows.push([]);
        csvRows.push(['Client Name', 'Email', 'Total Orders', 'Total Spent (INR)']);
        topCustomers.forEach((c: any) => {
          const name = c.user ? `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() : 'VIP Client';
          const email = c.user?.email || '';
          csvRows.push([name, email, String(c.orderCount || 0), String(c.totalSpent || 0)]);
        });
      } else if (rep.endpoint === 'inventory') {
        const res = await adminService.getInventoryReport();
        const summary = res.data?.summary || {};
        const catBreakdown = res.data?.categoryBreakdown || [];

        csvRows.push(['MONOLITH LUXURY - INVENTORY AUDIT REPORT']);
        csvRows.push(['Export Timestamp', new Date().toISOString()]);
        csvRows.push(['Total Active Products', String(summary.totalProducts || 0)]);
        csvRows.push(['Total Stock Units', String(summary.totalStock || 0)]);
        csvRows.push(['Low Stock Items (<= 5 units)', String(summary.lowStock || 0)]);
        csvRows.push(['Out of Stock Items', String(summary.outOfStock || 0)]);
        csvRows.push([]);
        csvRows.push(['Category', 'SKU Count', 'Total Stock Units', 'Inventory Value (INR)']);
        catBreakdown.forEach((cat: any) => {
          csvRows.push([
            cat.categoryName || 'General',
            String(cat.productCount || 0),
            String(cat.totalStock || 0),
            String(cat.inventoryValue || 0),
          ]);
        });
      } else if (rep.endpoint === 'returns') {
        const res = await adminService.getReturnsReport();
        const summary = res.data?.summary || {};
        const statusBreakdown = res.data?.statusBreakdown || [];

        csvRows.push(['MONOLITH LUXURY - RETURNS & ALTERATIONS REPORT']);
        csvRows.push(['Export Timestamp', new Date().toISOString()]);
        csvRows.push(['Total Return Requests', String(summary.totalReturns || 0)]);
        csvRows.push(['Total Refund Value (INR)', String(summary.totalRefundAmount || 0)]);
        csvRows.push([]);
        csvRows.push(['Status', 'Request Count', 'Refund Total (INR)']);
        statusBreakdown.forEach((s: any) => {
          csvRows.push([s._id || 'Pending', String(s.count || 0), String(s.totalAmount || 0)]);
        });
      }

      // Convert rows to CSV string
      const csvString = csvRows
        .map((row) =>
          row
            .map((field) => {
              const str = String(field ?? '');
              return str.includes(',') || str.includes('"') || str.includes('\n')
                ? `"${str.replace(/"/g, '""')}"`
                : str;
            })
            .join(',')
        )
        .join('\r\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${rep.id.toLowerCase()}_production_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage(`Report "${rep.title}" exported successfully from live database.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || `Failed to generate ${rep.title} from backend.`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Production Financial & Operations Reports
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Generate and download certified CSV reports calculated directly from your MongoDB Atlas database.
            </p>
          </div>
          <AdminButton
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleDownload(AVAILABLE_REPORTS[0])}
            disabled={Boolean(downloadingId)}
          >
            Export Primary Sales Ledger
          </AdminButton>
        </div>

        {statusMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="font-medium">{statusMessage}</p>
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {AVAILABLE_REPORTS.map((rep) => (
            <div
              key={rep.id}
              className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-primary bg-surface-container px-2.5 py-1 rounded-md border border-outline-variant">
                    {rep.category}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-base font-bold text-primary">{rep.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {rep.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
                <div className="text-[11px] text-on-surface-variant">
                  Format: <strong className="text-primary">{rep.format}</strong>
                </div>

                <AdminButton
                  variant="outline"
                  leftIcon={
                    downloadingId === rep.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )
                  }
                  onClick={() => handleDownload(rep)}
                  disabled={Boolean(downloadingId)}
                >
                  {downloadingId === rep.id ? 'Generating...' : 'Download CSV'}
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
