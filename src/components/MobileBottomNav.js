import React from 'react';

const MobileBottomNav = ({ onCreateMemo, onLogout, onToggleCategories, isAuthenticated, showCategories }) => {
  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 sm:hidden">
      <div className="flex items-center justify-around py-3">
        {/* 분류 버튼 */}
        <button
          onClick={onToggleCategories}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 ${
            showCategories 
              ? 'bg-purple-100 text-purple-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-2xl">📁</span>
        </button>

        {/* 새 메모 버튼 */}
        <button
          onClick={onCreateMemo}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-2xl">+</span>
        </button>

        {/* 로그아웃 버튼 */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center w-12 h-12 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-2xl">🚪</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
