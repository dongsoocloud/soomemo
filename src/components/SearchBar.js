import React from 'react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-4 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="메모 검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64 md:w-80 pl-12 pr-12 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
      />
      {searchQuery && (
        <button 
          className="absolute right-3 bg-gray-100/80 hover:bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
          onClick={() => onSearchChange('')}
          title="검색 초기화"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
