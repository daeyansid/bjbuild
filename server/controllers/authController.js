const User = require('../models/User');
const BranchAdmin = require('../models/BranchAdmin');
const UserRole = require('../models/UserRole')
const Branch = require('../models/Branch')
const BranchSetting = require('../models/BranchSettings');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
require('dotenv').config();


// Get all branch admin
exports.getAllBranchAdmins = async (req, res) => {
    try {
        const branchAdmins = await BranchAdmin.find().populate('userId', 'username email userRole');
        sendSuccessResponse(res, 200, 'Branch admins retrieved successfully', branchAdmins);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};


// Delete branch admin
exports.deleteBranchAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const branchAdmin = await BranchAdmin.findById(id).populate('userId', 'username email userRole');
        if (!branchAdmin) {
            return sendErrorResponse(res, 404, 'Branch admin not found');
        }

        // Delete the associated User
        await User.findByIdAndDelete(branchAdmin.userId);

        // Delete the BranchAdmin
        await branchAdmin.remove();

        sendSuccessResponse(res, 200, 'Branch admin and associated user deleted successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};


// Edit Branch Admin
exports.editBranchAdmin = async (req, res) => {
    const { id } = req.params;
    const { fullName, cnicNumber, phoneNumber, address, salary, gender } = req.body;

    try {
        const branchAdmin = await BranchAdmin.findById(id);
        if (!branchAdmin) {
            return sendErrorResponse(res, 404, 'Branch admin not found');
        }

        branchAdmin.fullName = fullName || branchAdmin.fullName;
        branchAdmin.cnicNumber = cnicNumber || branchAdmin.cnicNumber;
        branchAdmin.phoneNumber = phoneNumber || branchAdmin.phoneNumber;
        branchAdmin.address = address || branchAdmin.address;
        branchAdmin.salary = salary || branchAdmin.salary;
        branchAdmin.gender = gender || branchAdmin.gender;

        const updatedBranchAdmin = await branchAdmin.save();

        // Populate the userRole field
        await updatedBranchAdmin.populate('userId', 'username email userRole').execPopulate();

        sendSuccessResponse(res, 200, 'Branch admin updated successfully', updatedBranchAdmin);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map(e => ({
                path: e.path,
                message: e.message
            }));

            sendErrorResponse(res, 400, 'Validation error', {
                errors: errorMessages,
                _message: err.message,
                name: err.name
            });
        } else {
            console.error(err.message);
            sendErrorResponse(res, 500, 'Server error', err);
        }
    }
};


// Get Branch Admin by ID
exports.getBranchAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const branchAdmin = await BranchAdmin.findById(id)
            .populate('userId', 'username email userRole'); // Populate specific fields

        if (!branchAdmin) {
            return sendErrorResponse(res, 404, 'Branch admin not found');
        }

        sendSuccessResponse(res, 200, 'Branch admin retrieved successfully', branchAdmin);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, 400, 'Invalid credentials');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 400, 'Invalid credentials');
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Remove password from user object before sending response
        user.password = null;

        // Prepare payload for JWT
        const payload = {
            user: {
                id: user.id,
                userRole: user.userRole
            }
        };

        // Generate a JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            async (err, token) => {
                if (err) throw err;

                // Prepare response data
                let responseData = { token, user };

                if (user.userRole === 'branchAdmin') {
                    // Find the BranchAdmin document
                    const branchAdmin = await BranchAdmin.findOne({ userId: user.id }).populate('userId');
                    if (branchAdmin) {
                        responseData.branchAdmin = branchAdmin;

                        // Find the Branch document using the assignedTo field
                        const branch = await Branch.findOne({ assignedTo: branchAdmin._id }).populate('assignedTo');
                        if (branch) {
                            responseData.branch = branch;

                            // Find the BranchSetting document using the branchSettings field
                            const branchSetting = await BranchSetting.findOne({ branchId: branch._id });
                            if (branchSetting) {
                                responseData.branchSetting = branchSetting;
                            }

                            // Add additional fields to response
                            responseData.branchId = branch._id;
                        } else {
                            responseData.branchId = null;
                        }

                        responseData.userId = branchAdmin.userId ? branchAdmin.userId._id : null;
                        responseData.fullName = branchAdmin.fullName || null;
                    } else {
                        responseData.branchAdmin = null;
                    }
                }

                // Send response with success
                res.cookie('token', token, { httpOnly: true });
                sendSuccessResponse(res, 200, 'Login successful', responseData);
            }
        );
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};


// ==============
// Register superAdmin
exports.registerSuperAdmin = async (req, res) => {
    const { username, password, email, userRole } = req.body;

    // Check for empty fields
    if (!username || !password || !email || !userRole) {
        return sendErrorResponse(res, 400, 'All fields are required');
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return sendErrorResponse(res, 400, 'User already exists');
        }

        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            email,
            userRole,
        });

        await user.save();
        sendSuccessResponse(res, 200, 'User registered successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Register branchAdmin
exports.registerBranchAdmin = async (req, res) => {
    const { username, password, email, userRole, fullName, cnicNumber, phoneNumber, address, salary, gender } = req.body;

    // Validate required fields
    const missingFields = validateRequiredFields({ username, password, email, userRole, fullName, cnicNumber, phoneNumber, address, salary, gender });
    if (missingFields.length > 0) {
        return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(res, 400, 'User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User entry
        const user = new User({
            username,
            password: hashedPassword,
            email,
            userRole,
        });

        const savedUser = await user.save();

        // Create a new BranchAdmin entry
        const branchAdmin = new BranchAdmin({
            fullName,
            cnicNumber,
            phoneNumber,
            address,
            salary,
            gender,
            userId: savedUser._id
        });

        const savedBranchAdmin = await branchAdmin.save();

        sendSuccessResponse(res, 201, 'Branch admin registered successfully', { user: savedUser, branchAdmin: savedBranchAdmin });
    } catch (err) {
        if (err.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const errorMessages = Object.values(err.errors).map(e => ({
                path: e.path,
                message: e.message
            }));

            sendErrorResponse(res, 400, 'Validation error', {
                errors: errorMessages,
                _message: err.message,
                name: err.name
            });
        } else {
            console.error(err.message);
            sendErrorResponse(res, 500, 'Server error', err);
        }
    }
};
// ==============

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return sendErrorResponse(res, 400, 'Invalid or expired token');
        }

        // Check if the token is still valid
        if (user.token !== token) {
            return sendErrorResponse(res, 400, 'Invalid or expired token');
        }

        // Hash the new password and update the user's password
        user.password = await bcrypt.hash(newPassword, 10);
        user.token = null;  // Clear the token
        await user.save();

        sendSuccessResponse(res, 200, 'Password has been reset successfully');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Switch session to a branch admin or back to super admin
exports.switchSession = async (req, res) => {
    const { branchAdminId } = req.body;

    try {
        let user;

        if (branchAdminId === 'Super Admin') {
            // Find the super admin by role
            user = await User.findOne({ userRole: 'Super Admin' });
        } else {
            user = await User.findById(branchAdminId);
            if (!user || user.userRole !== 'Branch Admin') {
                return sendErrorResponse(res, 404, 'Branch admin not found');
            }
        }

        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        const token = jwt.sign(
            { id: user.id, role: user.userRole },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });
        sendSuccessResponse(res, 200, 'Login successful', { token, user });
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Password Recovery
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, 400, 'User not found');
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset',
            text: `Click here to reset your password: ${resetUrl}`,
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`
        });

        user.token = token;
        await user.save();

        sendSuccessResponse(res, 200, 'Password reset link sent');
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
// ==============