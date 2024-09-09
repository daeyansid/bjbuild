const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const branchRoutes = require('./routes/branchRoutes');
const branchAdminRoutes = require('./routes/branchAdmin');
const branchTypeRoutes = require('./routes/branchTypeRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const classRoutes = require('./routes/classRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const staffRoutes = require('./routes/staffRoutes');
const guardianRoutes = require('./routes/guardianRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoute = require('./routes/studentRoutes');

const app = express();
connectDB();

app.get('/ping', (req, res) => {
    res.send('pinged');
});

// Middlewares
const corsOptions = {
    origin: '*', // Adjust this to your specific domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Static File Serving
app.use('/assets/images/branchAdmin', express.static(path.join(__dirname, 'assets', 'images', 'branchAdmin')));
app.use('/assets/images/staff', express.static(path.join(__dirname, 'assets', 'images', 'staff')));
app.use('/assets/images/teacher', express.static(path.join(__dirname, 'assets', 'images', 'teacher')));
app.use('/assets/images/student', express.static(path.join(__dirname, 'assets', 'images', 'student')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/branch-admin', branchAdminRoutes);
app.use('/api/branch-type', branchTypeRoutes);
app.use('/api/user-role', userRoleRoutes);
app.use('/api/class', classRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/guardian', guardianRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoute);

// Serve Client Build
const buildPath = path.join(__dirname, '../client/dist');
app.use(express.static(buildPath));

// Catch-All Route: Serve index.html for any request that isn't handled by the above routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
