const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { createCommentInput, updateCommentInput } = require("../validations/blog.validation");

const createComment = async (req, res) => {
    const { blogId } = req.params;
    const commentPayload = req.body;
    const parsedPayload = createCommentInput.safeParse(commentPayload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Inputs',
            errors: parsedPayload.error.issues
        })
    }

    try {
        const { comment } = parsedPayload.data;
        const isBlogExist = await Blog.findById(blogId);

        if(!isBlogExist) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        const createComment = await Comment.create({
            blog: blogId,
            author: req.userId,
            comment
        })

        await Blog.findByIdAndUpdate(blogId, {
            $inc: {
                commentsCount: 1
            }
        })

        res.json({
            success: true,
            message: "Comment created successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const comments = async (req, res) => {
    const { blogId } = req.params;
    try {
        const isBlogExist = await Blog.findById(blogId);

        if(!isBlogExist) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const getComments = await Comment.find({
            blog: blogId
        }).sort({
            createdAt: -1
        })
        res.json({
            success: true,
            message: "Comment featched successfully",
            comments: getComments
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const commentPayload = req.body;
    const parsedPayload = updateCommentInput.safeParse(commentPayload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Inputs',
            errors: parsedPayload.error.issues
        })
    }

    try {
        const { comment } = parsedPayload.data;
        const getComments = await Comment.findOneAndUpdate({
            _id: commentId,
            author: req.userId
        }, {
            comment
        })
        res.json({
            success: true,
            message: "Comment updated successfully"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const isCommentExists = await Comment.findOne({
            _id: commentId
        })
        
        if(!isCommentExists) {
            return res.status(404).json({
                success: false,
                message: "commnet not found"
            });
        }

        const deleteComment = await Comment.findOneAndDelete({
            _id: commentId,
            author: req.userId
        })
        
        await Blog.findByIdAndUpdate(isCommentExists.blog, {
            $inc: {
                commentsCount: -1
            }
        })
        res.json({
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const commentNotFound = (req, res) => {
    return res.status(404).json({
        success: false,
        message: '404 Not Found'
    })
}

module.exports = {
    createComment,
    comments,
    updateComment,
    deleteComment
}