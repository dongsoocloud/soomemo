const { syncDatabase, User, Category } = require('./models');

const initializeDatabase = async () => {
  try {
    // 데이터베이스 동기화 (force: false로 기존 데이터 보존)
    await syncDatabase();
    
    console.log('데이터베이스 초기화가 완료되었습니다.');
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };
