import React from 'react';

const MemoItem = ({ memo, onEdit, onDelete, categories }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    onEdit(memo);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('이 메모를 삭제하시겠습니까?')) {
      onDelete(memo.id);
    }
  };

  const getCategoryInfo = () => {
    return categories.find(cat => cat.id === memo.categoryId) || categories[0];
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300/50 relative group overflow-hidden"
      onClick={handleEdit}
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {memo.title || '제목 없음'}
            </h3>
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
              style={{ 
                backgroundColor: categoryInfo.color,
                boxShadow: `0 4px 14px 0 ${categoryInfo.color}40`
              }}
            >
              <span className="w-2 h-2 bg-white/30 rounded-full mr-2"></span>
              {categoryInfo.name}
            </div>
          </div>
          <button 
            className="bg-red-500/90 hover:bg-red-600 text-white rounded-xl w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-110 opacity-0 group-hover:opacity-100"
            onClick={handleDelete}
            title="삭제"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          {memo.content ? (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
              {memo.content.length > 100 ? `${memo.content.substring(0, 100)}...` : memo.content}
            </p>
          ) : (
            <p className="text-gray-400 italic text-sm">내용이 없습니다</p>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-medium">{formatDate(memo.createdAt)}</span>
              {memo.updatedAt !== memo.createdAt && (
                <span className="text-gray-400 text-xs">(수정됨)</span>
              )}
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoItem;
