import React from 'react';
import Chatbot from '../components/Chatbot';

const MakeupAR = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">ChatBot - Trợ lý làm đẹp</h1>
          <p className="text-sm sm:text-lg text-gray-600">
            Đặt câu hỏi về makeup, skincare, và sản phẩm làm đẹp
          </p>
        </div>
        <Chatbot />
      </div>
    </div>
  );
};

export default MakeupAR;
