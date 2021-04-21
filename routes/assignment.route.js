const express = require('express');

const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const assignmentController = require('../controllers/assignment.controller');
const { createAssignment } = require('../validations/assignment.validation');
const ROLES = require('../ROLES');

const router = express.Router();

router
  .route('/')
  .get(assignmentController.getAssignment)
  .post(
    auth(ROLES.faculty),
    validate(createAssignment),
    assignmentController.createAssignment,
  )
  .delete(
    auth(ROLES.faculty),
    assignmentController.deleteAssignemnt,
  );

module.exports = router;
