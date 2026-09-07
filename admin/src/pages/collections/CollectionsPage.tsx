import React, { useState, useEffect } from 'react';
import { Plus, Boxes, Sparkles, Calendar, User, Edit, Trash2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminDrawer } from '../../components/ui/AdminDrawer';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminImageUpload } from '../../components/ui/AdminImageUpload';
import { adminService } from '../../services/adminService';

export interface CollectionItem {
  id: string;
  name: string;
  season: string;
  itemCount: number;
  status: 'Published' | 'Upcoming' | 'Archived';
  curator: string;
  image: string;
  description: string;
  releaseDate?: string;
}

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [curator, setCurator] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<CollectionItem['status']>('Published');

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getCollections();
      const rawList = res.data || [];
      const mapped: CollectionItem[] = rawList.map((c: any) => ({
        id: c._id || c.id,
        name: c.name || 'Untitled Collection',
        season: c.season || 'Permanent Capsule',
        itemCount: c.productCount || c.itemCount || 0,
        status: c.isActive === false ? 'Archived' : (c.status || 'Published'),
        curator: c.curator || 'Atelier MONOLITH',
        image: c.image || c.bannerImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        description: c.description || '',
        releaseDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      }));
      setCollections(mapped);
    } catch (err: any) {
      console.error('Failed to load collections:', err);
      setError(err.message || 'Unable to load collections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setName('');
    setSeason('Autumn / Winter 2024');
    setCurator('Atelier Creative Studio');
    setDescription('');
    setImage('');
    setStatus('Published');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (col: CollectionItem) => {
    setEditingCollection(col);
    setName(col.name);
    setSeason(col.season);
    setCurator(col.curator);
    setDescription(col.description);
    setImage(col.image);
    setStatus(col.status);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name.trim()) return;

    try {
      const payload: any = {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        season: season.trim(),
        curator: curator.trim(),
        isActive: status === 'Published',
      };

      if (editingCollection) {
        await adminService.updateCollection(editingCollection.id, payload);
      } else {
        await adminService.createCollection(payload);
      }
      setIsDrawerOpen(false);
      await fetchCollections();
    } catch (err: any) {
      alert(err.message || 'Failed to save collection');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    try {
      await adminService.deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete collection');
    }
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

        {/* Content State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Loading collections from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-2xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchCollections}>
              Retry
            </AdminButton>
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-2xl text-center px-4">
            <Boxes className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <h3 className="font-display text-base font-bold text-primary">No collections found</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
              Create your first capsule or seasonal drop to curate pieces together.
            </p>
            <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd} className="mt-4">
              Create Collection
            </AdminButton>
          </div>
        ) : (
          /* Editorial Grid */
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
        )}
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
