const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Players',
      key: 'id'
    }
  },
  opponent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  runs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wickets: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  result: {
    type: DataTypes.ENUM('won', 'lost', 'draw', 'no-result'),
    defaultValue: 'no-result'
  }
});

module.exports = Match;