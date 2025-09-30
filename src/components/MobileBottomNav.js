import React from 'react';

const MobileBottomNav = ({ onCreateMemo, onLogout, isAuthenticated }) => {
  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 sm:hidden">
      <div className="flex items-center justify-around py-2">
        {/* 새 메모 버튼 */}
        <button
          onClick={onCreateMemo}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-2xl mb-1">+</span>
          <span className="text-xs font-medium">새 메모</span>
        </button>

        {/* 로그아웃 버튼 */}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-2xl mb-1">🚪</span>
          <span className="text-xs font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
