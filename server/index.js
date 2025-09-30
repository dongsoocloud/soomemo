const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./init');
const authRoutes = require('./routes/auth');
const memoRoutes = require('./routes/memos');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (프로덕션 빌드)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/memos', memoRoutes);
app.use('/api/categories', categoryRoutes);

// React 앱 서빙 (프로덕션)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error('서버 시작 오류:', error);
    process.exit(1);
  }
};

startServer();
