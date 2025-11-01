import React from 'react';
import Chatbot from '../components/Chatbot';
import { MessageCircle, Sparkles } from 'lucide-react';

const MakeupAR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-6 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-3 tracking-tight">
            ChatBot - Trợ lý làm đẹp
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Đặt câu hỏi về makeup, skincare, và sản phẩm làm đẹp
            </p>
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>24/7 Available</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant Response</span>
            </div>
          </div>
        </div>
        <Chatbot />
      </div>
    </div>
  );
};

export default MakeupAR;
