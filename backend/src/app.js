const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blog.routes');
const commentRoutes = require('./routes/comment.routes');
const likesRoutes = require('./routes/like.routes');
const userRoutes = require('./routes/user.routes');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Blog API is running"
    });
});

app.use('/api/v1/auth', authRoutes );
app.use('/api/v1/blogs', blogRoutes );
app.use('/api/v1/comments', commentRoutes );
app.use('/api/v1/likes', likesRoutes );
app.use('/api/v1/users', userRoutes );

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;