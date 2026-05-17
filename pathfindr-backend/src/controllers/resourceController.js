const prisma = require('../config/db');
const logger = require('../utils/logger');

exports.getAllResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: resources });
  } catch (error) {
    logger.error('Get all resources error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch resources' });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 'fail', message: 'Resource ID is required' });
    }

    const resource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return res.status(404).json({ status: 'fail', message: 'Resource not found' });
    }

    res.status(200).json({ status: 'success', data: resource });
  } catch (error) {
    logger.error('Get resource by ID error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch resource' });
  }
};
