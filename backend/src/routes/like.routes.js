const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createLike, removeLike, like } = require('../controllers/like.controller');
const router = express.Router();

router.post('/:blogId', authMiddleware, createLike);
router.get('/:id', authMiddleware, like)
router.delete('/:id', authMiddleware, removeLike)

module.exports = router;