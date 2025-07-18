const { Player, Match } = require('../models');

async function updatePlayerStats(playerId) {
  try {
    const matches = await Match.findAll({ where: { playerId } });

    let totalRuns = 0, totalWickets = 0, fifties = 0, centuries = 0;

    matches.forEach(match => {
      totalRuns += match.runs;
      totalWickets += match.wickets;
      if (match.runs >= 50 && match.runs < 100) fifties++;
      if (match.runs >= 100) centuries++;
    });

    const average = matches.length ? (totalRuns / matches.length).toFixed(2) : 0;

    await Player.update({
      matches: matches.length,
      runs: totalRuns,
      wickets: totalWickets,
      fifties,
      centuries,
      average
    }, {
      where: { id: playerId }
    });
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

module.exports = updatePlayerStats;
