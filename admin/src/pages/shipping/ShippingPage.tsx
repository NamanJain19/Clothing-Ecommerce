import React, { useState } from 'react';
import { Truck, Plus, ShieldCheck, MapPin, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';

export interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  carrier: string;
  serviceType: string;
  baseRate: number;
  freeShippingThreshold: number;
  deliveryTime: string;
  status: 'Active' | 'Inactive';
}

export const initialShippingZones: ShippingZone[] = [
  {
    id: 'SHIP-01',
    name: 'India Domestic Priority & Metros',
    regions: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'All India Metros'],
    carrier: 'BlueDart Express (Air Priority)',
    serviceType: 'Insured Armored Transit',
    baseRate: 250,
    freeShippingThreshold: 5000,
    deliveryTime: '24-48 Hours',
    status: 'Active',
  },
  {
    id: 'SHIP-02',
    name: 'Metropolitan White-Glove Concierge',
    regions: ['South Mumbai', 'Lutyens Delhi', 'UB City Bengaluru'],
    carrier: 'Monolith Private Chauffeur',
    serviceType: 'Same-Day Hand Delivery & Fitting',
    baseRate: 1500,
    freeShippingThreshold: 50000,
    deliveryTime: 'Same Day (4 Hours)',
    status: 'Active',
  },
  {
    id: 'SHIP-03',
    name: 'International Diplomatic Dispatch',
    regions: ['Dubai', 'London', 'Paris', 'Singapore', 'New York'],
    carrier: 'DHL Express Worldwide Insured',
    serviceType: 'Customs Cleared Air Courier',
    baseRate: 4500,
    freeShippingThreshold: 100000,
    deliveryTime: '3-5 Business Days',
    status: 'Active',
  },
];

export const ShippingPage: React.FC = () => {
  const [zones, setZones] = useState<ShippingZone[]>(initialShippingZones);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [carrier, setCarrier] = useState('BlueDart Express (Air Priority)');
  const [serviceType, setServiceType] = useState('Insured Armored Transit');
  const [baseRate, setBaseRate] = useState('250');
  const [freeThreshold, setFreeThreshold] = useState('5000');
  const [deliveryTime, setDeliveryTime] = useState('24-48 Hours');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCarrier('BlueDart Express (Air Priority)');
    setServiceType('Insured Armored Transit');
    setBaseRate('250');
    setFreeThreshold('5000');
    setDeliveryTime('24-48 Hours');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: ShippingZone) => {
    setEditingId(zone.id);
    setName(zone.name);
    setCarrier(zone.carrier);
    setServiceType(zone.serviceType);
    setBaseRate(zone.baseRate.toString());
    setFreeThreshold(zone.freeShippingThreshold.toString());
    setDeliveryTime(zone.deliveryTime);
    setIsModalOpen(true);
  };

  const handleSaveZone = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name.trim()) return;

    if (editingId) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === editingId
            ? {
                ...z,
                name,
                carrier,
                serviceType,
                baseRate: parseFloat(baseRate) || 0,
                freeShippingThreshold: parseFloat(freeThreshold) || 0,
                deliveryTime,
              }
            : z
        )
      );
    } else {
      const newZone: ShippingZone = {
        id: `SHIP-0${zones.length + 1}`,
        name,
        regions: ['India Domestic & Priority Hubs'],
        carrier,
        serviceType,
        baseRate: parseFloat(baseRate) || 0,
        freeShippingThreshold: parseFloat(freeThreshold) || 0,
        deliveryTime,
        status: 'Active',
      };
      setZones([...zones, newZone]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Shipping & Armored Logistics
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Configure courier delivery rates, free shipping thresholds, and armored transit partners in ₹ (INR).
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add Shipping Zone
          </AdminButton>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <AdminBadge variant="success">{zone.status}</AdminBadge>
                </div>

                <h3 className="font-bold text-base text-primary mt-4">{zone.name}</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Carrier: <span className="font-semibold text-on-surface">{zone.carrier}</span>
                </p>
                <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                  Protocol: {zone.serviceType}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {zone.regions.map((reg) => (
                    <span
                      key={reg}
                      className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[11px] font-medium rounded-md border border-outline-variant/60"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Base Transit Rate</span>
                  <span className="font-bold text-primary font-mono">₹{zone.baseRate.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Complimentary Free Delivery</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    Orders over ₹{zone.freeShippingThreshold.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Estimated Delivery</span>
                  <span className="font-medium text-on-surface">{zone.deliveryTime}</span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(zone)}
                    className="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
                    title="Edit Zone"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                    title="Delete Zone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Shipping Zone' : 'Add Shipping Zone'}
        description="Establish courier parameters, free delivery threshold, and security transit protocols."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveZone}>
              {editingId ? 'Save Changes' : 'Save Shipping Zone'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSaveZone} className="space-y-4">
          <AdminInput
            label="Zone Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. All India Priority Air"
            required
          />
          <AdminInput
            label="Carrier Name"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
          />
          <AdminInput
            label="Service Level"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Base Rate (₹ INR)"
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
            />
            <AdminInput
              label="Complimentary Over (₹ INR)"
              type="number"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
            />
          </div>
          <AdminInput
            label="Delivery Window"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default ShippingPage;
