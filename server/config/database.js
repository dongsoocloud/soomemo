const { Sequelize } = require('sequelize');

// 환경에 따라 데이터베이스 설정
let sequelize;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // 프로덕션 환경 (Railway)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // 개발 환경 (SQLite)
  const path = require('path');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  });
}

module.exports = sequelize;
