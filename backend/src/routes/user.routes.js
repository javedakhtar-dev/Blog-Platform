const express = require('express');
const { users, updateUserProfile, updateUserPassword } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, users);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/password', authMiddleware, updateUserPassword);

module.exports = router;

