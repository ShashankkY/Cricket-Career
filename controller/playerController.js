const { Player, Match } = require('../models');
const { Op } = require('sequelize');
const updatePlayerStats = require('../utils/updateStats');

// Get all players with matches
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.findAll({
      include: [{ model: Match, attributes: ['id', 'opponent', 'date', 'runs', 'wickets', 'result'] }]
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, {
      include: [{ model: Match, attributes: ['id', 'opponent', 'date', 'runs', 'wickets', 'result'] }]
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔧 FIXED: Search players by name OR birthplace
exports.searchPlayerByName = async (req, res) => {
  try {
    const searchTerm = req.params.name.toLowerCase();
    const players = await Player.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { birthplace: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      include: [{ model: Match }]
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new player
exports.createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing player
exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    await player.update(req.body);
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    await player.destroy();
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a match to a player
exports.addMatchForPlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const match = await Match.create({
      ...req.body,
      playerId: req.params.id
    });

    await updatePlayerStats(req.params.id);
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
