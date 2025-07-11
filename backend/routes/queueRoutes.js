module.exports = (context) => {
  const router = require('express').Router();
  const controller = require('../controllers/queueController')(context);

  router.post('/', controller.joinQueue);
  router.get('/', controller.getAllQueues);
  router.get('/last', controller.getLastQueueNumber);
  router.put('/:id', controller.markAsProcessed);

  return router;
};