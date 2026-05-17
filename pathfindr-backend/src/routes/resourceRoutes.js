const express = require('express');
const { getAllResources, getResourceById } = require('../controllers/resourceController');

const router = express.Router();

router.get('/', getAllResources);
router.get('/:id', getResourceById);

module.exports = router;
