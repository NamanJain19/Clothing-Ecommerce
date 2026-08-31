import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Eye } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminBreadcrumb } from '../../components/ui/AdminBreadcrumb';
import { initialEmailTemplates } from '../../data/storeOperations';

export const EditEmailTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const template =
    initialEmailTemplates.find((t) => t.id === id) || initialEmailTemplates[0];

  const [title, setTitle] = useState(template.title);
  const [subject, setSubject] = useState(template.subject);
  const [trigger, setTrigger] = useState(template.trigger);
  const [content, setContent] = useState(
    `Dear {{customer_name}},\n\nYour acquisition {{order_number}} has been processed by our master tailors.\n\nCourier Tracking: {{tracking_code}}\n\nWith our highest compliments,\nMONOLITH Atelier Concierge`
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
                { label: template.title },
              ]}
            />
            <h1 className="font-display text-headline-lg sm:text-display text-primary mt-1">
              Edit: {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" onClick={() => navigate('/admin/email-templates')}>
              Cancel
            </AdminButton>
            <AdminButton isLoading={isSaving} onClick={handleSave}>
              Save Updates
            </AdminButton>
          </div>
        </div>

        {/* 60/40 Editor & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
          {/* Editor */}
          <div className="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
              Template Editor
            </h3>

            <AdminInput
              label="Template Internal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <AdminInput
              label="Email Subject Line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block font-label-md text-sm text-on-surface">
                Body Content (Template Liquid Format)
              </label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg p-3 font-mono text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
              <Eye className="w-4 h-4 text-outline" />
              <h3 className="font-headline-md text-headline-md text-primary">Live Dispatch Preview</h3>
            </div>

            <div className="border border-outline-variant rounded-xl bg-surface p-4 space-y-3 text-xs">
              <div className="border-b border-outline-variant/60 pb-2 space-y-1">
                <p>
                  <span className="text-on-surface-variant">From:</span> MONOLITH Concierge
                  &lt;concierge@monolith.luxury&gt;
                </p>
                <p>
                  <span className="text-on-surface-variant">Subject:</span>{' '}
                  <span className="font-bold text-primary">{subject}</span>
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
