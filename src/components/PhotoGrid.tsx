
import React from 'react';
import { Photo } from '@/pages/Index';
import { Search, Image as ImageIcon } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  searchMode: boolean;
  totalPhotos: number;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, searchMode, totalPhotos }) => {
  if (photos.length === 0 && !searchMode) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Photos Yet</h3>
          <p className="text-gray-500">Upload some photos to get started with smart organization!</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0 && searchMode) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Similar Faces Found</h3>
          <p className="text-gray-500">Try searching with a different image or adjust your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">
          {searchMode ? 'Search Results' : 'Your Photos'}
        </h2>
        <div className="text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
          {searchMode 
            ? `${photos.length} of ${totalPhotos} photos` 
            : `${photos.length} photos`
          }
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.url}
                alt="Uploaded photo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-sm font-medium truncate">{photo.file.name}</p>
              <p className="text-xs text-gray-200">
                {(photo.file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
