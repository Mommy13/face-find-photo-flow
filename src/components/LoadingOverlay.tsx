
import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Processing Photos</h3>
            <p className="text-gray-600 text-sm">AI is analyzing your images...</p>
          </div>
          
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
