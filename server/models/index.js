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
    await sequelize.sync({ force: false }); // force: true는 기존 테이블을 삭제하고 재생성
    console.log('데이터베이스가 성공적으로 동기화되었습니다.');
  } catch (error) {
    console.error('데이터베이스 동기화 오류:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Memo,
  Category,
  syncDatabase
};
