import React from 'react';
import { CollectionCard } from '../collection/CollectionCard';
import { collectionsData } from '../../data/collections';

export const EditorialCollections: React.FC = () => {
  const col1 = collectionsData.find((c) => c.id === 'col-01') || collectionsData[0];
  const col2 = collectionsData.find((c) => c.id === 'col-02') || collectionsData[1];
  const col3 = collectionsData.find((c) => c.id === 'col-03') || collectionsData[2];
  const col4 = collectionsData.find((c) => c.id === 'col-04') || collectionsData[3];

  return (
    <section className="w-full bg-background py-24" id="collections">
      <div className="max-w-[1600px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Tall Column */}
          <div className="w-full md:w-7/12 flex flex-col gap-8 lg:gap-12">
            <CollectionCard
              collection={col1}
              showArrowIcon={true}
              titleSizeClass="text-5xl md:text-6xl"
              paddingClass="p-12"
              textSizeClass="text-sm md:text-base max-w-sm"
            />
            <CollectionCard
              collection={col4}
              showArrowIcon={false}
              titleSizeClass="text-3xl md:text-4xl"
              paddingClass="p-10"
              textSizeClass="text-xs md:text-sm max-w-xs"
            />
          </div>

          {/* Wide/Short Column */}
          <div className="w-full md:w-5/12 flex flex-col gap-8 lg:gap-12 pt-0 md:pt-32">
            <CollectionCard
              collection={col2}
              showArrowIcon={false}
              titleSizeClass="text-3xl md:text-4xl"
              paddingClass="p-10"
              textSizeClass="text-xs md:text-sm max-w-xs"
            />
            <CollectionCard
              collection={col3}
              showArrowIcon={false}
              titleSizeClass="text-3xl md:text-4xl"
              paddingClass="p-10"
              textSizeClass="text-xs md:text-sm max-w-xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
