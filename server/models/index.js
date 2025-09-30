const sequelize = require('../config/database');
const User = require('./User');
const Memo = require('./Memo');
const Category = require('./Category');

// 모델 관계 설정
User.hasMany(Memo, { foreignKey: 'userId', as: 'memos' });
Memo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Memo, { foreignKey: 'categoryId', as: 'memos' });
Memo.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// 데이터베이스 동기화
const syncDatabase = async () => {
  try {
    console.log('🔄 데이터베이스 동기화 시작...');
    
    // 먼저 연결 테스트
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 기존 테이블 확인
    try {
      const [results] = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
      console.log('📋 기존 테이블들:', results.map(r => r.tablename));
    } catch (queryError) {
      console.log('⚠️ 기존 테이블 조회 실패:', queryError.message);
    }
    
    // 기존 테이블이 있으면 삭제 (임시 - 테스트용)
    if (process.env.RESET_DATABASE === 'true') {
      console.log('🗑️ 기존 테이블 삭제 중...');
      await sequelize.query('DROP TABLE IF EXISTS "Memos" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "Categories" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE;');
      console.log('✅ 기존 테이블 삭제 완료');
    }
    
    // 기존 방식으로 동기화 (force: false로 기존 데이터 보존)
    console.log('📋 테이블 동기화...');
    await sequelize.sync({ force: false });
    console.log('✅ 테이블 동기화 완료');
    
    console.log('✅ 데이터베이스가 성공적으로 동기화되었습니다.');
    
    // 최종 테이블 확인
    try {
      const [results] = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
      console.log('📋 최종 테이블들:', results.map(r => r.tablename));
    } catch (queryError) {
      console.log('⚠️ 최종 테이블 조회 실패 (정상 동작에 영향 없음):', queryError.message);
    }
  } catch (error) {
    console.error('❌ 데이터베이스 동기화 오류:', {
      message: error.message,
      name: error.name,
      code: error.code,
      parent: error.parent?.message,
      sql: error.sql
    });
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Memo,
  Category,
  syncDatabase
};
