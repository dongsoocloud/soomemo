const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://soomemo-production.up.railway.app/api'
  : 'http://localhost:5000/api';

// 토큰 가져오기
const getToken = () => localStorage.getItem('token');

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  console.log('🌐 API 요청:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    headers: config.headers
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  console.log('📡 API 응답:', {
    status: response.status,
    ok: response.ok,
    url: response.url
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    const errorData = await response.json();
    console.error('❌ API 오류:', errorData);
    throw new Error(errorData.message || 'API 요청 실패');
  }

  const data = await response.json();
  console.log('✅ API 성공:', data);
  return data;
};

// 인증 관련 API
export const authAPI = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (username, email, password) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  getMe: () => apiRequest('/auth/me'),
};

// 메모 관련 API
export const memoAPI = {
  getMemos: (categoryId, search) => {
    const params = new URLSearchParams();
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    
    return apiRequest(`/memos?${params.toString()}`);
  },

  getMemo: (id) => apiRequest(`/memos/${id}`),

  createMemo: (memoData) =>
    apiRequest('/memos', {
      method: 'POST',
      body: JSON.stringify(memoData),
    }),

  updateMemo: (id, memoData) =>
    apiRequest(`/memos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memoData),
    }),

  deleteMemo: (id) =>
    apiRequest(`/memos/${id}`, {
      method: 'DELETE',
    }),
};

// 카테고리 관련 API
export const categoryAPI = {
  getCategories: () => apiRequest('/categories'),

  createCategory: (categoryData) =>
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),

  updateCategory: (id, categoryData) =>
    apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (id) =>
    apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    }),
};
