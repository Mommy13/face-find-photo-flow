
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Sparkles } from 'lucide-react';
import { Photo } from '@/pages/Index';
import { toast } from 'sonner';

interface UploadAreaProps {
  onPhotosUploaded: (photos: Photo[]) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onPhotosUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      const photos: Photo[] = await Promise.all(
        acceptedFiles.map(async (file) => {
          const url = URL.createObjectURL(file);
          return {
            id: Math.random().toString(36).substr(2, 9),
            url,
            file,
          };
        })
      );
      
      onPhotosUploaded(photos);
    } catch (error) {
      toast.error('Error uploading photos');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onPhotosUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out transform hover:scale-[1.02]
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
            : 'border-gray-300 bg-white/50 backdrop-blur-sm hover:border-purple-400 hover:bg-purple-50/50'
          }
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`
              p-6 rounded-full bg-gradient-to-r transition-all duration-300
              ${isDragActive 
                ? 'from-blue-500 to-purple-500 scale-110' 
                : 'from-purple-400 to-blue-400 hover:scale-110'
              }
            `}>
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-white" />
              )}
            </div>
            {!isUploading && (
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-pulse" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {isUploading ? 'Processing your photos...' : 
               isDragActive ? 'Drop your photos here!' : 'Upload Your Photos'}
            </h3>
            <p className="text-gray-600">
              {isUploading ? 'Please wait while we prepare your images' :
               isDragActive ? 'Release to add them to your collection' :
               'Drag & drop images here, or click to browse'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Image className="w-4 h-4" />
            <span>Supports JPEG, PNG, GIF, WebP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
