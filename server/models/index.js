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
    
    // 테이블을 순서대로 생성 (외래키 의존성 고려)
    console.log('👤 Users 테이블 동기화...');
    await User.sync({ force: false });
    console.log('✅ Users 테이블 동기화 완료');
    
    console.log('📁 Categories 테이블 동기화...');
    await Category.sync({ force: false });
    console.log('✅ Categories 테이블 동기화 완료');
    
    console.log('📝 Memos 테이블 동기화...');
    await Memo.sync({ force: false });
    console.log('✅ Memos 테이블 동기화 완료');
    
    console.log('✅ 데이터베이스가 성공적으로 동기화되었습니다.');
    
    // 테이블 존재 여부 확인
    try {
      const [results] = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
      console.log('📋 생성된 테이블들:', results.map(r => r.tablename));
    } catch (queryError) {
      console.log('⚠️ 테이블 목록 조회 실패 (정상 동작에 영향 없음):', queryError.message);
    }
  } catch (error) {
    console.error('❌ 데이터베이스 동기화 오류:', {
      message: error.message,
      name: error.name,
      code: error.code,
      parent: error.parent?.message
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
