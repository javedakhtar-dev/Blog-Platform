const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createComment, updateComment, deleteComment, comments } = require('../controllers/comment.controller');
const router = express.Router();

router.post('/:blogId', authMiddleware, createComment);
router.get('/:blogId', comments);
router.put('/:commentId', authMiddleware, updateComment);
router.delete('/:commentId', authMiddleware, deleteComment)

module.exports = router;