const express = require('express');

const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const noticeController = require('../controllers/notice.controller');
const ROLES = require('../ROLES');
const { noticeValidation } = require('../validations');

const router = express.Router();

router
  .route('/')
  .get(noticeController.getNotices)
  .post(
    auth(ROLES.admin),
    validate(noticeValidation.createNotice),
    noticeController.createNotice,
  )
  .delete(
    auth(ROLES.admin),
    noticeController.deleteNotices,
  );

module.exports = router;
