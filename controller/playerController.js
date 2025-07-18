const { Player, Match } = require('../models');
const { Op } = require('sequelize');
const updatePlayerStats = require('../utils/updateStats');

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

exports.searchPlayerByName = async (req, res) => {
  try {
    const players = await Player.findAll({
      where: {
        name: { [Op.like]: `%${req.params.name}%` }
      },
      include: [{ model: Match }]
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
