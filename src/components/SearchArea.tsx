
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Search, X, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Photo } from '@/pages/Index';
import { FaceDetector } from '@/utils/faceDetection';
import { toast } from 'sonner';

interface SearchAreaProps {
  photos: Photo[];
  onSearch: (results: Photo[]) => void;
  onClearSearch: () => void;
  searchMode: boolean;
}

export const SearchArea: React.FC<SearchAreaProps> = ({ 
  photos, 
  onSearch, 
  onClearSearch, 
  searchMode 
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchImage, setSearchImage] = useState<string | null>(null);

  const performSearch = async (searchFile: File) => {
    setIsSearching(true);
    try {
      const faceDetector = new FaceDetector();
      await faceDetector.initialize();
      
      // Create URL for search image
      const searchUrl = URL.createObjectURL(searchFile);
      setSearchImage(searchUrl);
      
      // Detect faces in search image
      const searchFaces = await faceDetector.detectFaces(searchUrl);
      
      if (searchFaces.length === 0) {
        toast.error('No faces detected in the search image');
        setSearchImage(null);
        return;
      }
      
      console.log(`Found ${searchFaces.length} faces in search image`);
      
      // Find similar faces in uploaded photos
      const similarPhotos: Photo[] = [];
      
      for (const photo of photos) {
        if (!photo.faces || photo.faces.length === 0) continue;
        
        // Check similarity with each face in the photo
        let maxSimilarity = 0;
        for (const photoFace of photo.faces) {
          for (const searchFace of searchFaces) {
            const similarity = faceDetector.calculateSimilarity(searchFace, photoFace);
            maxSimilarity = Math.max(maxSimilarity, similarity);
          }
        }
        
        // If similarity is above threshold, include the photo
        if (maxSimilarity > 0.6) { // Threshold for similarity
          similarPhotos.push(photo);
          console.log(`Photo ${photo.id} similarity: ${maxSimilarity.toFixed(3)}`);
        }
      }
      
      onSearch(similarPhotos);
      toast.success(`Found ${similarPhotos.length} similar photos`);
      
    } catch (error) {
      toast.error('Error during search');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await performSearch(acceptedFiles[0]);
    }
  }, [photos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleClearSearch = () => {
    onClearSearch();
    setSearchImage(null);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">Smart Face Search</h2>
        {searchMode && (
          <Button 
            onClick={handleClearSearch}
            variant="outline" 
            size="sm"
            className="ml-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Search
          </Button>
        )}
      </div>
      
      {searchImage && (
        <div className="mb-4 flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
          <img 
            src={searchImage} 
            alt="Search reference" 
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Search Reference</p>
            <p className="text-xs text-gray-600">Finding similar faces...</p>
          </div>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
          }
          ${isSearching ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`
            p-4 rounded-full bg-gradient-to-r transition-all duration-300
            ${isDragActive 
              ? 'from-purple-500 to-blue-500 scale-110' 
              : 'from-purple-400 to-blue-400 hover:scale-110'
            }
          `}>
            {isSearching ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800">
              {isSearching ? 'Searching for similar faces...' :
               isDragActive ? 'Drop image to search!' :
               'Upload a face to find similar photos'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isSearching ? 'AI is analyzing facial features' :
               'Drop an image or click to browse'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
