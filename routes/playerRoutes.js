const express = require('express');
const router = express.Router();
const playerController = require('../controller/playerController');

// Place specific routes BEFORE dynamic ones
router.get('/search/:name', playerController.searchPlayerByName);
router.get('/:id', playerController.getPlayerById);

router.get('/', playerController.getAllPlayers);
router.post('/', playerController.createPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.post('/:id/matches', playerController.addMatchForPlayer);

module.exports = router;
