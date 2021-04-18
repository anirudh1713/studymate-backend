const express = require('express');

const validate = require('../middlewares/validate');
const { createSubject } = require('../validations/subject.validation');
const subjectController = require('../controllers/subject.controller');
const { auth } = require('../middlewares/auth');
const ROLES = require('../ROLES');

const router = express.Router();

router
  .route('/')
  .post(
    auth(ROLES.admin),
    validate(createSubject),
    subjectController.createSubject,
  )
  .get(subjectController.getSubjects)
  .delete(
    auth(ROLES.admin),
    subjectController.deleteSubject,
  );

module.exports = router;
