const express = require('express');
const termController = require('../controllers/term.controller');

const router = express.Router();

router
  .route('/:id')
  .get(termController.getTerms);

router
  .route('/department/:department')
  .get(termController.getTermsByDepartment);

module.exports = router;
