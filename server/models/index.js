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
    
    // 원시 SQL로 테이블 생성 (외래키 의존성 고려)
    console.log('👤 users 테이블 생성...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ users 테이블 생성 완료');
    
    console.log('📁 categories 테이블 생성...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL DEFAULT '#6c757d',
        user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ categories 테이블 생성 완료');
    
    console.log('📝 memos 테이블 생성...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS memos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        category_id INTEGER NOT NULL REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE,
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ memos 테이블 생성 완료');
    
    // 기존 테이블에 order 컬럼 추가 (마이그레이션)
    console.log('🔄 기존 테이블에 order 컬럼 추가 중...');
    try {
      // categories 테이블에 order 컬럼 추가
      await sequelize.query(`
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
      `);
      console.log('✅ categories 테이블에 order 컬럼 추가 완료');
    } catch (error) {
      console.log('⚠️ categories order 컬럼 추가 실패 (이미 존재할 수 있음):', error.message);
    }
    
    try {
      // memos 테이블에 order 컬럼 추가
      await sequelize.query(`
        ALTER TABLE memos 
        ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
      `);
      console.log('✅ memos 테이블에 order 컬럼 추가 완료');
    } catch (error) {
      console.log('⚠️ memos order 컬럼 추가 실패 (이미 존재할 수 있음):', error.message);
    }
    
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
