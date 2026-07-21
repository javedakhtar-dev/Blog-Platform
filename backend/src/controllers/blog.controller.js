const { createBlogInput, updateBlogInput } = require('../validations/blog.validation');
const Blog = require('../models/Blog');
const slugGenerator = require('../utils/slugGenerator');

const createBlog = async (req, res) => {
    const createBlogPayload = req.body;
    const parsedPayload = createBlogInput.safeParse(createBlogPayload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Inputs',
            errors: parsedPayload.error.issues
        })
    }

    try {
        const { title, content, coverImage, category, tags } = parsedPayload.data;
        const baseSlug = slugGenerator(title);
        let slug = baseSlug;

        while(await Blog.findOne({slug})) {
            slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`
        }

        const blog = await Blog.create({
            title,
            slug,
            content,
            coverImage,
            author: req.userId,
            category,
            tags
        })

        res.json({
            success: true,
            message: "Blog created successfully"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const getBlog = async (req, res) => {
    const { search, category, sort, limit, page } = req.query;
    const filter = {}
    
    if(search) {
        filter.title = {
            $regex: search,
            $options: 'i'
        };
    }
    if(category) {
        filter.category = category
    }
    
    const sortBlog = {}
    
    if(sort == 'newest') {
        sortBlog.createdAt = -1
    } else if(sort == 'oldest') {
        sortBlog.createdAt = 1
    } else {
        sortBlog.createdAt = -1
    }

    const onPage = Math.max(parseInt(page) || 1, 1);
    const limitBlog = Math.min(parseInt(limit) || 20, 20);
    
    const skipBlog = ( onPage - 1 ) * limitBlog;

    try {
        const blogs = await Blog.find(
            filter
        ).sort(
            sortBlog
        ).skip(
            skipBlog
        ).limit(
            limitBlog
        )

        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limitBlog);

        return res.json({
            blogs,
            page: onPage,
            limit: limitBlog,
            count: blogs.length,
            totalPages,
            totalBlogs
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const getSlugBlog = async (req, res) => {
    const { slug } = req.params;
    try {
        const blog = await Blog.findOne({
            slug
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.json({
            success: true,
            message: 'Blog founded',
            blog
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const blogUpdatePayload = req.body;
    const parsedPayload = updateBlogInput.safeParse(blogUpdatePayload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Inputs',
            errors: parsedPayload.error.issues
        })
    }

    try {
        const { title, content, coverImage, category, tags } = parsedPayload.data;
        const baseSlug = slugGenerator(title);
        let slug = baseSlug;

        while(await Blog.findOne({slug})) {
            slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`
        }
        const blog = await Blog.findOneAndUpdate({
            _id: id,
            author: req.userId
        }, {
            title,
            content,
            slug,
            coverImage,
            category,
            tags
        })

        return res.json({
            success: true,
            message: "Blog updated successfully"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const deleteBlog = async (req, res) => {
    const { blogId } = req.params;
    try {
        const blog = await Blog.findOneAndDelete({
            _id: blogId,
            author: req.userId
        })
        return res.json({
            success: true,
            message: 'Blog deleted successfully'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const getMyBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            author: req.userId
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.json({
            success: true,
            message: 'Blog founded',
            blog
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const blogNotFound = (req, res) => {
    return res.status(404).json({
        success: false,
        message: '404 Not Found'
    })
}

module.exports = {
    createBlog,
    getBlog,
    getSlugBlog,
    updateBlog,
    deleteBlog,
    getMyBlog
}