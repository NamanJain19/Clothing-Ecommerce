import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TrendingCollectionsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-section-gap">
      <div className="flex justify-between items-end mb-12 border-b border-outline-variant pb-6">
        <div>
          <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 block">
            Trending Series
          </span>
          <h2 className="font-display-lg text-4xl">Trending Collections</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Card 1 */}
        <div
          onClick={() => navigate('/women')}
          className="relative group overflow-hidden border border-outline/10 cursor-pointer"
        >
          <div className="aspect-square w-full overflow-hidden bg-surface-container-low">
            <img
              alt="Luxury Essentials"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZNKbeC6tbKNKUGYH0u690uKr4J3Glb3K8jjeqsCGTQM60D7HDHloDJxhgkg4xVaDB-Wl-9s2EFsuoU_25p-GLAylUMfbOtZxSfdpGCnd83EFUDcSJiDKHzLf57bngJr893SOSNf_R16IQPuhMTqO-OebVcbtCohbGtdlrO1c4w12JlwHDqgfTvS5U3JgH7UnQCFRLtodIK6iB-UZii4v-l3WvWuIMsyJscbGBzYCpU8ZVhJRxoLdFsw"
            />
          </div>
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-10 text-white">
            <h3 className="font-headline-md text-3xl mb-2">Luxury Essentials</h3>
            <p className="font-body-md text-sm text-white/80 mb-6 max-w-xs">
              The foundation of the modern wardrobe.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/women');
              }}
              className="w-fit font-label-caps text-[10px] uppercase tracking-widest border border-white px-6 py-3 hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              Shop Essentials
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => navigate('/new-arrivals')}
          className="relative group overflow-hidden border border-outline/10 cursor-pointer"
        >
          <div className="aspect-square w-full overflow-hidden bg-surface-container-low">
            <img
              alt="Limited Edition Archive"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6kdqskCDpbfM74zT5PBx4fhS5S2MX-NJ-KF9hW8AfWrQlMu7kwJ8HOHE81K53RFjcZ6xFh4Sn-o8a_4kgeYml4-QY0tbc_DQxLOXduoIK9BpCYb1WVIfRZh8bd7bJP8M99DomdCEwd_r4AnUicaEzMxmQ69hGvawmXCyN6ZSQG6AgdDuQRwg4hXueaDItVfjTr5SB8fEbP77iBWQxwd2X1GOJ4_YZxKcVRLPsMJ0Hnp8p20ASJDXCzQ"
            />
          </div>
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-10 text-white">
            <h3 className="font-headline-md text-3xl mb-2">Limited Edition</h3>
            <p className="font-body-md text-sm text-white/80 mb-6 max-w-xs">
              Exclusive avant-garde garments and limited run pieces.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/new-arrivals');
              }}
              className="w-fit font-label-caps text-[10px] uppercase tracking-widest border border-white px-6 py-3 hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              Access Archive
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
