const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cricket_db', 'root', 'Shashank@12', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
