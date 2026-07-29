const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getBlog, createBlog, getSlugBlog, deleteBlog, updateBlog, getMyBlog } = require('../controllers/blog.controller');
const router = express.Router();

router.post('/', authMiddleware, createBlog);
router.get('/', getBlog);
router.get('/myblogs', authMiddleware, getMyBlog);
router.get('/:slug', getSlugBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;