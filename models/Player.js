// Player Model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  birthplace: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  career: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  matches: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  runs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  fifties: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  centuries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wickets: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  average: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  }
});

module.exports = Player;