const Player = require('./Player');
const Match = require('./Match');

Player.hasMany(Match, { foreignKey: 'playerId' });
Match.belongsTo(Player, { foreignKey: 'playerId' });

module.exports = { Player, Match };
