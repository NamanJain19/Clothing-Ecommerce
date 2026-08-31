import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Eye, Code } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminBreadcrumb } from '../../components/ui/AdminBreadcrumb';

export const CreateEmailTemplatePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [trigger, setTrigger] = useState('Order Placed');
  const [content, setContent] = useState(
    `Dear {{customer_name}},\n\nYour acquisition {{order_number}} has been registered with our Geneva vault.\n\nEstimated Courier Departure: {{shipping_date}}\n\nWith our highest compliments,\nMONOLITH Atelier Concierge`
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/admin/email-templates');
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1200px] mx-auto w-full space-y-space-lg">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <AdminBreadcrumb
              items={[
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Email Templates', path: '/admin/email-templates' },
                { label: 'Create Template' },
              ]}
            />
            <h1 className="font-display text-headline-lg sm:text-display text-primary mt-1">
              Create Email Template
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" onClick={() => navigate('/admin/email-templates')}>
              Cancel
            </AdminButton>
            <AdminButton isLoading={isSaving} onClick={handleSave}>
              Save & Activate
            </AdminButton>
          </div>
        </div>

        {/* 60/40 Editor & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
          {/* Editor (60%) */}
          <div className="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
              Template Configuration
            </h3>

            <AdminInput
              label="Template Internal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VIP Private Salon Invitation"
              required
            />

            <AdminInput
              label="Email Subject Line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Private Invitation: Monolith Autumn Salon MMXXIV"
              required
            />

            <AdminSelect
              label="Automation Trigger Event"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              options={[
                { value: 'Order Placed', label: 'Acquisition Confirmed' },
                { value: 'Order Shipped', label: 'Armored Courier Dispatched' },
                { value: 'VIP Tier Upgrade', label: 'VIP Bespoke Elevation' },
                { value: 'Manual Concierge', label: 'Manual Private Dispatch' },
              ]}
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-label-md text-sm text-on-surface">
                  Email Body Content (Markdown / Liquid Tags)
                </label>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  Available: {'{{customer_name}}'}, {'{{order_number}}'}
                </span>
              </div>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg p-3 font-mono text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Live Preview (40%) */}
          <div className="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
              <Eye className="w-4 h-4 text-outline" />
              <h3 className="font-headline-md text-headline-md text-primary">Client Inbox Preview</h3>
            </div>

            <div className="border border-outline-variant rounded-xl bg-surface p-4 space-y-3 text-xs">
              <div className="border-b border-outline-variant/60 pb-2 space-y-1">
                <p>
                  <span className="text-on-surface-variant">From:</span> MONOLITH Concierge
                  &lt;concierge@monolith.luxury&gt;
                </p>
                <p>
                  <span className="text-on-surface-variant">Subject:</span>{' '}
                  <span className="font-bold text-primary">{subject || '(Subject line...)'}</span>
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-outline-variant/40 space-y-3 font-serif">
                <div className="text-center pb-2 border-b border-outline-variant/40">
                  <span className="font-sans font-black tracking-widest text-sm text-primary">
                    MONOLITH
                  </span>
                </div>
                <p className="text-on-surface whitespace-pre-line leading-relaxed text-xs">
                  {content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
