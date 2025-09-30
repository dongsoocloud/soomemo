import React, { useState, useEffect } from 'react';

const MemoEditor = ({ memo, onSave, onCancel, isCreating, categories, onCategoryChange }) => {
  const [title, setTitle] = useState(memo.title || '');
  const [content, setContent] = useState(memo.content || '');

  useEffect(() => {
    setTitle(memo.title || '');
    setContent(memo.content || '');
  }, [memo]);

  const handleSave = () => {
    const updatedMemo = {
      ...memo,
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString()
    };
    onSave(updatedMemo);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    onCategoryChange(categoryId);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 flex flex-col w-full h-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300" onKeyDown={handleKeyDown}>
      {/* 헤더 - 모바일에서는 간소화 */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-t-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-sm sm:text-lg">✏️</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {isCreating ? '새 메모 작성' : '메모 수정'}
          </h2>
        </div>
        {/* 데스크톱에서만 상단 버튼 표시 */}
        <div className="hidden sm:flex gap-3">
          <button 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleSave}
          >
            <span className="flex items-center gap-2">
              <span>💾</span>
              저장
            </span>
          </button>
          <button 
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleCancel}
          >
            <span className="flex items-center gap-2">
              <span>❌</span>
              취소
            </span>
          </button>
          <button 
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleCancel}
            title="ESC 키로도 닫을 수 있습니다"
          >
            <span className="flex items-center gap-2">
              <span>✕</span>
            </span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-4 py-4 border-2 border-gray-200/50 rounded-2xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl bg-white/70 backdrop-blur-sm"
              placeholder="제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <select
            className="px-4 py-4 border-2 border-gray-200/50 rounded-2xl text-sm bg-white/70 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 min-w-[140px] shadow-lg hover:shadow-xl"
            value={memo.categoryId}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 relative">
          <textarea
            className="w-full h-full px-4 py-4 border-2 border-gray-200/50 rounded-2xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 min-h-[400px] shadow-lg hover:shadow-xl bg-white/70 backdrop-blur-sm"
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
      
      {/* 데스크톱 하단 - 단축키 안내 */}
      <div className="hidden sm:block p-6 border-t border-gray-100/50 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-b-2xl">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          <span className="font-medium">단축키: Ctrl+S (저장), Esc (취소)</span>
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
        </div>
      </div>

      {/* 모바일 하단 - 저장/취소 버튼 */}
      <div className="sm:hidden p-4 border-t border-gray-100/50 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-b-2xl">
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleSave}
          >
            <span className="flex items-center justify-center gap-2">
              <span>💾</span>
              저장
            </span>
          </button>
          <button 
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleCancel}
          >
            <span className="flex items-center justify-center gap-2">
              <span>❌</span>
              취소
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoEditor;
