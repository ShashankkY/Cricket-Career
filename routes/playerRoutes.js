const express = require('express');
const router = express.Router();
const playerController = require('../controller/playerController');

router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.get('/search/:name', playerController.searchPlayerByName);
router.post('/', playerController.createPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.post('/:id/matches', playerController.addMatchForPlayer);

module.exports = router;
