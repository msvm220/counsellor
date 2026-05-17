const express = require('express');
const router = express.Router();
const counselorController = require('../controllers/counselorController');

router.get('/', counselorController.getAllCounselors);
router.get('/:id', counselorController.getCounselorById);

module.exports = router;
