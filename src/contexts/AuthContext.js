import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setForceLogout } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // 토큰 유효성 검증
          const userData = await authAPI.getMe();
          setUser(userData.user);
        } catch (error) {
          // 토큰이 유효하지 않은 경우
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 로그인 시도:', { email });
      const data = await authAPI.login(email, password);
      console.log('✅ 로그인 성공:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      console.log('💾 사용자 상태 업데이트:', data.user);
      return data;
    } catch (error) {
      console.error('❌ 로그인 실패:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('📝 회원가입 시도:', { username, email });
      const data = await authAPI.register(username, email, password);
      console.log('✅ 회원가입 성공:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      
      // 서버에서 받은 오류 응답 처리
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        if (serverError.errors && Array.isArray(serverError.errors)) {
          // 유효성 검사 오류
          const validationError = new Error(serverError.message);
          validationError.errors = serverError.errors;
          throw validationError;
        } else if (serverError.message) {
          // 일반적인 서버 오류
          throw new Error(serverError.message);
        }
      }
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 강제 로그아웃 (토큰 만료 시)
  const forceLogout = () => {
    console.log('🔑 강제 로그아웃 실행');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // API 서비스에 강제 로그아웃 함수 등록
  useEffect(() => {
    setForceLogout(forceLogout);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forceLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
