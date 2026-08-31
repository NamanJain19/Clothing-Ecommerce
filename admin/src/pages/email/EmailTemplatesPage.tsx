import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Plus, Edit, Trash2, Send, Eye } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { initialEmailTemplates, EmailTemplate } from '../../data/storeOperations';

export const EmailTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSendTest = (title: string) => {
    alert(`Test dispatch transmitted for "${title}" to admin mailbox.`);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Transactional Email Templates
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Curate automated client correspondence, order confirmations, and VIP salon invitations.
            </p>
          </div>
          <AdminButton
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/admin/email-templates/new')}
          >
            Create Template
          </AdminButton>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <AdminBadge variant={tpl.status === 'Active' ? 'success' : 'neutral'}>
                    {tpl.status}
                  </AdminBadge>
                </div>

                <h3 className="font-bold text-base text-primary mt-4">{tpl.title}</h3>
                <p className="text-xs font-medium text-on-surface mt-1">
                  Subject:{' '}
                  <span className="font-normal text-on-surface-variant">{tpl.subject}</span>
                </p>
                <p className="text-xs text-outline mt-0.5">Trigger: {tpl.trigger}</p>
              </div>

              <div className="pt-4 border-t border-outline-variant flex items-center justify-between text-xs">
                <span className="text-outline">Updated: {tpl.lastModified}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendTest(tpl.title)}
                    className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Send Test Dispatch"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/email-templates/${tpl.id}/edit`)}
                    className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Edit Template"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
