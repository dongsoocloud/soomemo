const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL, {
  dialect: 'postgres',
  logging: false, // SQL 로그 비활성화
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

module.exports = sequelize;
