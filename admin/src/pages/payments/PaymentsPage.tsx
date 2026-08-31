import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Landmark,
  Cpu,
  Smartphone,
  Truck,
  Key,
  Check,
  Download,
  Filter,
  ArrowDownToLine,
  QrCode,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { storeSettingsService, StoreSettings } from '../../services/storeSettingsService';

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  provider: string;
  type: string;
  currency: string;
  feePercentage: number;
  dailyVolume: number;
  status: 'Connected' | 'Disabled';
  testMode: boolean;
}

export const PaymentsPage: React.FC = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(storeSettingsService.getSettings());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState(storeSettings.razorpayKeyId || 'rzp_test_1DP5mmOlF5G5ag');
  const [razorpaySecret, setRazorpaySecret] = useState('••••••••••••••••••••••••');
  const [isSaved, setIsSaved] = useState(false);
  const [methodFilter, setMethodFilter] = useState<'All' | 'COD' | 'Online'>('All');

  const gateways: PaymentGatewayConfig[] = [
    {
      id: 'GW-01',
      name: 'Razorpay Instant Payment Gateway',
      provider: 'Razorpay Technologies',
      type: 'UPI (GPay/PhonePe) / Credit & Debit Cards / Net Banking',
      currency: 'INR (₹)',
      feePercentage: 1.8,
      dailyVolume: 285400,
      status: storeSettings.razorpayEnabled ? 'Connected' : 'Disabled',
      testMode: true,
    },
    {
      id: 'GW-02',
      name: 'Cash on Delivery (Doorstep Cash / UPI)',
      provider: 'BlueDart / Delhivery Express',
      type: 'Cash on Delivery (COD)',
      currency: 'INR (₹)',
      feePercentage: 0,
      dailyVolume: 114000,
      status: storeSettings.codEnabled ? 'Connected' : 'Disabled',
      testMode: false,
    },
    {
      id: 'GW-03',
      name: 'Direct Bank Transfer (NEFT / RTGS / IMPS)',
      provider: 'HDFC / ICICI Corporate Banking',
      type: 'Direct Bank Account Transfer',
      currency: 'INR (₹)',
      feePercentage: 0,
      dailyVolume: 65000,
      status: 'Connected',
      testMode: false,
    },
  ];

  const toggleGateway = (id: string) => {
    if (id === 'GW-01') {
      const updated = storeSettingsService.saveSettings({ razorpayEnabled: !storeSettings.razorpayEnabled });
      setStoreSettings(updated);
    } else if (id === 'GW-02') {
      const updated = storeSettingsService.saveSettings({ codEnabled: !storeSettings.codEnabled });
      setStoreSettings(updated);
    }
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storeSettingsService.saveSettings({ razorpayKeyId });
    setStoreSettings(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsConfigOpen(false);
    }, 800);
  };

  const transactions = [
    {
      id: 'TXN-9023',
      orderNumber: 'ORD-9824',
      paymentId: 'pay_P39k18491x',
      client: 'Rohit Sharma',
      amount: 125000,
      method: 'Razorpay UPI (Google Pay)',
      isCOD: false,
      date: 'Aug 29, 2026, 08:34 PM',
      status: 'Captured',
    },
    {
      id: 'TXN-9022',
      orderNumber: 'ORD-9823',
      paymentId: 'pay_K10492810m',
      client: 'Pooja Hegde',
      amount: 84500,
      method: 'Razorpay Credit Card (HDFC Infinia)',
      isCOD: false,
      date: 'Aug 29, 2026, 06:12 PM',
      status: 'Captured',
    },
    {
      id: 'TXN-9021',
      orderNumber: 'ORD-9821',
      paymentId: 'cod_order_8820',
      client: 'Vikramaditya Roy',
      amount: 210000,
      method: 'Cash on Delivery (COD)',
      isCOD: true,
      date: 'Aug 28, 2026, 03:45 PM',
      status: 'Pending Doorstep Collection',
    },
    {
      id: 'TXN-9020',
      orderNumber: 'ORD-9818',
      paymentId: 'pay_N91827401v',
      client: 'Ananya Singhania',
      amount: 45000,
      method: 'Razorpay UPI (PhonePe)',
      isCOD: false,
      date: 'Aug 28, 2026, 11:20 AM',
      status: 'Captured',
    },
    {
      id: 'TXN-9019',
      orderNumber: 'ORD-9815',
      paymentId: 'cod_order_8815',
      client: 'Kabir Malhotra',
      amount: 62000,
      method: 'Cash on Delivery (COD)',
      isCOD: true,
      date: 'Aug 27, 2026, 04:15 PM',
      status: 'Paid & Delivered',
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (methodFilter === 'COD') return t.isCOD;
    if (methodFilter === 'Online') return !t.isCOD;
    return true;
  });

  const handleDownloadStatement = () => {
    let csv = 'Transaction ID,Order Number,Customer Name,Payment Method,Amount (INR),Date,Status\n';
    filteredTransactions.forEach((t) => {
      csv += `${t.id},${t.orderNumber},"${t.client}","${t.method}",${t.amount},"${t.date}","${t.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monolith_payment_statement_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Payment Gateways & Transactions
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Configure Razorpay UPI, Cards & Cash on Delivery (COD) with real-time storefront synchronization.
            </p>
          </div>
          <div className="flex gap-2.5">
            <AdminButton
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadStatement}
            >
              Download Statement (CSV)
            </AdminButton>
            <AdminButton leftIcon={<Key className="w-4 h-4" />} onClick={() => setIsConfigOpen(true)}>
              Razorpay API Keys
            </AdminButton>
          </div>
        </div>

        {/* Payment Gateways Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {gateways.map((gw) => (
            <div
              key={gw.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                gw.status === 'Connected' ? 'border-outline-variant hover:border-primary/50' : 'border-neutral-200 opacity-60 bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center">
                    {gw.id === 'GW-01' ? (
                      <QrCode className="w-5 h-5" />
                    ) : gw.id === 'GW-02' ? (
                      <Truck className="w-5 h-5" />
                    ) : (
                      <Landmark className="w-5 h-5" />
                    )}
                  </div>
                  <AdminBadge variant={gw.status === 'Connected' ? 'success' : 'neutral'}>
                    {gw.status === 'Connected' ? 'Live & Active' : 'Disabled'}
                  </AdminBadge>
                </div>

                <h3 className="font-bold text-base text-primary mt-4">{gw.name}</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">{gw.provider}</p>
                <p className="text-xs text-on-surface leading-relaxed mt-2 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/50">
                  {gw.type}
                </p>
              </div>

              <div className="pt-4 border-t border-outline-variant space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Daily Volume Processed</span>
                  <span className="font-mono text-primary font-bold">₹{gw.dailyVolume.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => toggleGateway(gw.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gw.status === 'Connected'
                      ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      : 'bg-primary text-white hover:bg-neutral-800'
                  }`}
                >
                  {gw.status === 'Connected' ? 'Disable Gateway' : 'Enable Gateway Live'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions Ledger Table */}
        <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-base text-primary">Payment Transactions Ledger</h3>
              <p className="text-xs text-on-surface-variant">Detailed payment methods and settlement records in ₹ (INR)</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMethodFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  methodFilter === 'All' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setMethodFilter('Online')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  methodFilter === 'Online' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Online (UPI & Cards)
              </button>
              <button
                onClick={() => setMethodFilter('COD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  methodFilter === 'COD' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Cash on Delivery
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Order Ref</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Amount (₹ INR)</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-lowest transition-colors text-xs">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{tx.id}</td>
                    <td className="px-6 py-4 font-mono text-on-surface-variant">{tx.orderNumber}</td>
                    <td className="px-6 py-4 font-semibold text-on-surface">{tx.client}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        tx.isCOD
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                      }`}>
                        {tx.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-sm text-primary">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{tx.date}</td>
                    <td className="px-6 py-4">
                      <AdminBadge
                        variant={
                          tx.status === 'Captured' || tx.status === 'Paid & Delivered'
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {tx.status}
                      </AdminBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Razorpay API Modal */}
      <AdminModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        maxWidth="3xl"
        title="Razorpay Payment Gateway Credentials"
        description="Configure your live or sandbox Razorpay API Key ID and Key Secret."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveKeys}>Save Credentials</AdminButton>
          </>
        }
      >
        <form onSubmit={handleSaveKeys} className="space-y-4">
          {isSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              API credentials verified and saved!
            </div>
          )}
          <AdminInput
            label="Razorpay Key ID"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            placeholder="rzp_live_... or rzp_test_..."
            required
          />
          <AdminInput
            label="Razorpay Key Secret"
            type="password"
            value={razorpaySecret}
            onChange={(e) => setRazorpaySecret(e.target.value)}
            placeholder="••••••••••••••••••••••••"
            required
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default PaymentsPage;
