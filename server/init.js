const { syncDatabase, User, Category } = require('./models');

const initializeDatabase = async () => {
  try {
    // 데이터베이스 동기화
    await syncDatabase();
    
    // 기본 카테고리 생성 (각 사용자별로)
    console.log('데이터베이스 초기화가 완료되었습니다.');
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
  }
};

module.exports = { initializeDatabase };
