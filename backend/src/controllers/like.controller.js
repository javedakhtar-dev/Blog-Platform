const Blog = require("../models/Blog");
const Like = require("../models/Like");

const createLike = async (req, res) => {
    const { blogId } = req.params;
    try {
        const findBlog = await Blog.findById(blogId);

        if(!findBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        const checkLike = await Like.findOne({
            blog: blogId,
            author: req.userId
        })

        if(checkLike) {
            return res.status(409).json({
                success: false,
                message: 'Like already marked'
            })
        }

        await Like.create({
            blog: blogId,
            author: req.userId
        })

        await Blog.findByIdAndUpdate(blogId, {
            $inc: {
                likes: 1
            }
        })

        res.json({
            success: true,
            message: "Blog liked successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const like = async (req, res) => {
    const { id } = req.params;
    try {
        const likes = await Like.countDocuments({
            blog: id
        });

        res.json({
            success: true,
            message: "Like fetched",
            likes
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const removeLike = async (req, res) => {
    const { id } = req.params;
    try {
        const findBlog = await Blog.findById(id)

        if(!findBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            })
        }

        const checkLike = await Like.findOne({
            blog: id,
            author: req.userId
        })

        if(!checkLike) {
            return res.status(404).json({
                success: false,
                message: 'Like already not marked'
            })
        }

        await Like.findOneAndDelete({
            blog: id,
            author: req.userId
        })

        await Blog.findByIdAndUpdate(id, {
            $inc: {
                likes: -1
            }
        })

        res.json({
            success: true,
            message: "Like removed successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    createLike,
    like,
    removeLike
}