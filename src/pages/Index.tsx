
import React, { useState, useEffect } from 'react';
import { PhotoGrid } from '@/components/PhotoGrid';
import { UploadArea } from '@/components/UploadArea';
import { SearchArea } from '@/components/SearchArea';
import { Header } from '@/components/Header';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { toast } from 'sonner';

export interface Photo {
  id: string;
  url: string;
  file: File;
  faces?: any[];
  embedding?: number[];
}

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    setFilteredPhotos(photos);
  }, [photos]);

  const handlePhotosUploaded = async (newPhotos: Photo[]) => {
    setIsProcessing(true);
    try {
      // Process photos for face detection
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      toast.success(`${newPhotos.length} photos uploaded successfully!`);
    } catch (error) {
      toast.error('Error processing photos');
      console.error('Error processing photos:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async (searchResults: Photo[]) => {
    setFilteredPhotos(searchResults);
    setSearchMode(true);
  };

  const handleClearSearch = () => {
    setFilteredPhotos(photos);
    setSearchMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <div className="space-y-8">
          <UploadArea onPhotosUploaded={handlePhotosUploaded} />
          
          {photos.length > 0 && (
            <SearchArea 
              photos={photos} 
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              searchMode={searchMode}
            />
          )}
          
          <PhotoGrid 
            photos={filteredPhotos} 
            searchMode={searchMode}
            totalPhotos={photos.length}
          />
        </div>
      </div>
      
      {isProcessing && <LoadingOverlay />}
    </div>
  );
};

export default Index;
