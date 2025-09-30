import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import MemoList from './components/MemoList';
import MemoEditor from './components/MemoEditor';
import CategorySidebar from './components/CategorySidebar';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import AuthModal from './components/AuthModal';
import MobileBottomNav from './components/MobileBottomNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { memoAPI, categoryAPI } from './services/api';

function AppContent() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  
  // 디버깅을 위한 로그
  console.log('🔍 인증 상태:', {
    user,
    isAuthenticated,
    authLoading,
    token: localStorage.getItem('token')
  });
  const [memos, setMemos] = useState([]);
  const [editingMemo, setEditingMemo] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const [memosData, categoriesData] = await Promise.all([
        memoAPI.getMemos(selectedCategory, searchQuery),
        categoryAPI.getCategories()
      ]);
      
      setMemos(memosData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedCategory, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createNewMemo = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // 기본 카테고리 찾기
    const defaultCategory = categories.find(cat => cat.name === '기본') || categories[0];
    
    const newMemo = {
      id: Date.now(),
      title: '',
      content: '',
      categoryId: defaultCategory ? defaultCategory.id : null,
      createdAt: new Date().toISOString()
    };
    setEditingMemo(newMemo);
    setIsCreating(true);
  };

  const saveMemo = async (memoData) => {
    try {
      const memoToSave = {
        ...memoData,
        categoryId: memoData.categoryId || (categories.length > 0 ? categories[0].id : null)
      };
      
      let savedMemo;
      if (isCreating) {
        savedMemo = await memoAPI.createMemo(memoToSave);
        setMemos(prev => [savedMemo, ...prev]);
      } else {
        savedMemo = await memoAPI.updateMemo(memoData.id, memoToSave);
        setMemos(prev => prev.map(memo => 
          memo.id === memoData.id ? savedMemo : memo
        ));
      }
      
      setEditingMemo(null);
      setIsCreating(false);
    } catch (error) {
      console.error('메모 저장 오류:', error);
      alert(`메모 저장에 실패했습니다: ${error.message}`);
    }
  };

  const deleteMemo = async (id) => {
    try {
      await memoAPI.deleteMemo(id);
      setMemos(prev => prev.filter(memo => memo.id !== id));
      if (editingMemo && editingMemo.id === id) {
        setEditingMemo(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('메모 삭제 오류:', error);
      alert(`메모 삭제에 실패했습니다: ${error.message}`);
    }
  };

  const startEdit = (memo) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    const memoToEdit = {
      ...memo,
      categoryId: memo.categoryId || (categories.length > 0 ? categories[0].id : null)
    };
    setEditingMemo(memoToEdit);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingMemo(null);
    setIsCreating(false);
  };

  // 필터링된 메모 가져오기 (이제 서버에서 필터링하므로 그대로 반환)
  const getFilteredMemos = () => {
    return memos;
  };

  // 분류 관리 함수들
  const addCategory = async (name, color) => {
    try {
      const newCategory = await categoryAPI.createCategory({ name, color });
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('카테고리 생성 오류:', error);
      alert(`카테고리 생성에 실패했습니다: ${error.message}`);
    }
  };

  const updateCategory = async (id, name, color) => {
    try {
      const updatedCategory = await categoryAPI.updateCategory(id, { name, color });
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updatedCategory : cat
      ));
    } catch (error) {
      console.error('카테고리 수정 오류:', error);
      alert(`카테고리 수정에 실패했습니다: ${error.message}`);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryAPI.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      if (selectedCategory === id) {
        setSelectedCategory('all');
      }
      
      // 해당 카테고리의 메모들도 제거
      setMemos(prev => prev.filter(memo => memo.categoryId !== id));
    } catch (error) {
      console.error('카테고리 삭제 오류:', error);
      alert(`카테고리 삭제에 실패했습니다: ${error.message}`);
    }
  };

  const handleAuthSuccess = (userData) => {
    setShowAuthModal(false);
    // 인증 성공 후 데이터 다시 로드
    setTimeout(() => {
      loadData();
    }, 100);
  };

  // 모바일 카테고리 토글
  const toggleMobileCategories = () => {
    setShowMobileCategories(!showMobileCategories);
  };

  // 인증 로딩 중일 때 로딩 화면 표시
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">秀메모</h2>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">📝</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                秀메모
              </h1>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {isAuthenticated && (
                <SearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-semibold text-sm whitespace-nowrap">
                        {user?.username}님
                      </span>
                      <span className="text-gray-500 text-xs hidden sm:block">
                        안녕하세요!
                      </span>
                    </div>
                  </div>
                  {/* 데스크톱에서만 버튼 표시 */}
                  <div className="hidden sm:flex items-center gap-4">
                    <button 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={createNewMemo}
                    >
                      <span className="flex items-center gap-2">
                        <span>+</span>
                        새 메모
                      </span>
                    </button>
                    <button 
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={logout}
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowAuthModal(true)}
                >
                  로그인 / 회원가입
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {isAuthenticated ? (
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)] pb-20 sm:pb-8">
          {/* 데스크톱에서만 항상 표시, 모바일에서는 토글 */}
          <div className={`${showMobileCategories ? 'block' : 'hidden'} sm:block`}>
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
            />
          </div>
          
          <MemoList 
            memos={getFilteredMemos()}
            onEdit={startEdit}
            onDelete={deleteMemo}
            categories={categories}
            loading={loading}
            user={user}
          />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-5xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to 秀메모!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              로그인하여 개인 메모를 작성하고 관리해보세요.
            </p>
            <button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
              onClick={() => setShowAuthModal(true)}
            >
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* 모달로 편집기 표시 */}
      <Modal isOpen={!!editingMemo} onClose={cancelEdit}>
        <MemoEditor
          memo={editingMemo}
          onSave={saveMemo}
          onCancel={cancelEdit}
          isCreating={isCreating}
          categories={categories}
          onCategoryChange={(categoryId) => {
            setEditingMemo(prev => ({ ...prev, categoryId }));
          }}
        />
      </Modal>

      {/* 인증 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 모바일 하단 네비게이션 바 */}
      <MobileBottomNav 
        onCreateMemo={createNewMemo}
        onLogout={logout}
        onToggleCategories={toggleMobileCategories}
        isAuthenticated={isAuthenticated}
        showCategories={showMobileCategories}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
