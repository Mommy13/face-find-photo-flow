
import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Smart Photo Organizer
        </h1>
        <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Upload your photos and discover the power of AI-driven face recognition. 
        Find similar faces instantly with our smart search technology.
      </p>
    </div>
  );
};
