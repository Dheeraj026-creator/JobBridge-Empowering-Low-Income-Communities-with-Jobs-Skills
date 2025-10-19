const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const noCache = require('./middleware/noCache');
const Course = require('./models/Course');
const paymentRoutes2 = require('./routes/paymentdetailroute');
const MongoStore = require('connect-mongo');


if(process.env.NODE_ENV!="production"){
require('dotenv').config();}

const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const sessionConfig = require('./config/session');

const IdModel = require('./models/Idmodel');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.mongo_url,
     // See below for details
  })
}));
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session(sessionConfig));
app.use(flash());
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use(noCache);
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applyRoutes = require('./routes/applyRoutes');
const authRoutes = require('./routes/authRoutes');
const earningsRoutes = require('./routes/earningsRoutes');
const { authentication } = require('./middleware/authMiddleware');

app.use('/', authRoutes);
app.use('/', noCache, jobRoutes);
app.use('/admin', noCache, adminRoutes);
app.use('/', noCache, applyRoutes);
app.use('/', noCache, earningsRoutes);
app.use('/', require('./routes/paymentRoutes'));
app.use('/', paymentRoutes2);
app.get('/', (req, res) => res.render('home.ejs'));
app.get('/courses', authentication ,async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('courses', { courses });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading courses');
  }
});

// Start server
server.listen(port, async () => {
  try {
    await IdModel.deleteMany({});
    const ids = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
    await IdModel.insertMany(ids);
    console.log('✅ Generated 100 IDs.');
  } catch (err) {
    console.error(err);
  }
  console.log(`🚀 Server running on http://localhost:${port}`);
});
