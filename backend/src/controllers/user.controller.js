const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { updateProfileInput, updatePasswordInput } = require('../validations/auth.validation');

const users = async (req, res) => {
    try {
        const getProfile = await User.findById(req.userId)
        return res.json({
            profile: getProfile
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const updateUserProfile = async (req, res) => {
    const updateProfilePayload = req.body;
    const parsedPayload = updateProfileInput.safeParse(updateProfilePayload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Inputs',
            errors: parsedPayload.error.issues
        })
    }

    try {
        const { name, email, avatar, bio, role } = parsedPayload.data;
        const isExist = await User.findOne({email});
        await User.findByIdAndUpdate(req.userId, {
            name,
            email,
            avatar,
            bio,
            role
        })
        return res.json({
            success: true,
            message: 'Profile updated successfully'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Email already exist or Something went wrong'
        })
    }
}

const updateUserPassword = async (req, res) => {
    const updatePasswordPayload = req.body;
    const parsedPayload = updatePasswordInput.safeParse(updatePasswordPayload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Inputs',
            errors: parsedPayload.error.issues
        })
    }

    try {
        const { oldPassword, newPassword } = parsedPayload.data;
        
        const fetchUser = await User.findOne({
            _id: req.userId
        }).select('+password');

        const isPasswordCorrect = await bcrypt.compare(oldPassword, fetchUser.password);

        if(!isPasswordCorrect) {
            return res.status(403).json({
                success: false,
                message: 'Incorrect password'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(req.userId, {
            password: hashedPassword,
        })
        return res.json({
            success: true,
            message: 'Password updated successfully'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}
module.exports = {
    users,
    updateUserProfile,
    updateUserPassword
}