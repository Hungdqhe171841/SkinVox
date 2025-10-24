import React from 'react';

const MakeupAR = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ChatBot</h1>
        <p className="text-lg text-gray-600 mb-8">Coming Soon...</p>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeupAR;
