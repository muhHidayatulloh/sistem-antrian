const express = require('express');

const { pdfDownload } = require('../controllers/downloadController');

const router = express.Router();

router.get('/pdf/:filename', pdfDownload);

module.exports = router;