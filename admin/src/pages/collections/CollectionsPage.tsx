import React, { useState } from 'react';
import { Plus, Boxes, Sparkles, Calendar, User, Edit, Trash2, ArrowRight } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminDrawer } from '../../components/ui/AdminDrawer';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminImageUpload } from '../../components/ui/AdminImageUpload';
import { initialCollections, Collection } from '../../data/collections';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [curator, setCurator] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<Collection['status']>('Published');

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setName('');
    setSeason('Autumn / Winter 2024');
    setCurator('Atelier Creative Studio');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80');
    setStatus('Published');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (col: Collection) => {
    setEditingCollection(col);
    setName(col.name);
    setSeason(col.season);
    setCurator(col.curator);
    setDescription(col.description);
    setImage(col.image);
    setStatus(col.status);
    setIsDrawerOpen(true);
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name.trim()) return;

    if (editingCollection) {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === editingCollection.id
            ? {
                ...c,
                name,
                season,
                curator,
                description,
                image: image || c.image,
                status,
              }
            : c
        )
      );
    } else {
      const newCol: Collection = {
        id: `COL-0${collections.length + 1}`,
        name,
        season,
        curator,
        itemCount: 0,
        releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status,
        image: image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        description,
      };
      setCollections([...collections, newCol]);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">Collections</h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Curate seasonal drops, capsules, and limited edition editorial stories.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Create Collection
          </AdminButton>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={col.name}
                  src={col.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <AdminBadge variant={col.status === 'Published' ? 'success' : 'neutral'}>
                    {col.status}
                  </AdminBadge>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    {col.season}
                  </span>
                  <h3 className="font-display text-lg font-bold truncate">{col.name}</h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-3 border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span>{col.curator}</span>
                  </div>
                  <span className="font-semibold text-primary">{col.itemCount} Curated Pieces</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingCollection ? 'Edit Collection' : 'New Collection'}
        description="Configure seasonal theme and curator allocation."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave}>
              {editingCollection ? 'Update Collection' : 'Publish Collection'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <AdminInput
            label="Collection Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Winter Solstice 2024"
            required
          />
          <AdminInput
            label="Season / Capsule Period"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="e.g. Autumn / Winter"
          />
          <AdminInput
            label="Curator / Lead Designer"
            value={curator}
            onChange={(e) => setCurator(e.target.value)}
            placeholder="e.g. Elena Rostova"
          />
          <AdminImageUpload
            label="Collection Master Image (Direct File Upload)"
            value={image}
            onChange={setImage}
            aspectRatio="video"
            helperText="Upload collection cover photo (JPG, PNG, WEBP)"
            required
          />
          <div className="space-y-1.5">
            <label className="block font-label-md text-sm text-on-surface">Collection Story & Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Architectural volumes crafted in cashmere and tailored silhouettes..."
              className="w-full bg-surface border border-outline-variant rounded-lg p-3 outline-none text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block font-label-md text-sm text-on-surface">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-10 bg-surface border border-outline-variant rounded-lg px-3 outline-none text-sm text-on-surface"
            >
              <option value="Published">Published</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </form>
      </AdminDrawer>
    </AdminLayout>
  );
};
