import React from 'react';
import MemoItem from './MemoItem';

const MemoList = ({ memos, onEdit, onDelete, categories, loading, user }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">📋</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800">메모 목록</h2>
          <p className="text-sm text-gray-500">
            {user?.username}님의 메모 {memos.length}개
          </p>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
      </div>
      
      {loading ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">로딩 중...</h3>
          <p className="text-gray-500">메모를 불러오고 있습니다.</p>
        </div>
      ) : memos.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">메모가 없습니다</h3>
          <p className="text-gray-500 mb-6">
            {user?.username}님의 첫 번째 메모를 작성해보세요!
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memos.map(memo => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onEdit={onEdit}
              onDelete={onDelete}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoList;
