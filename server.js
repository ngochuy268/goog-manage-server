const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const employeeRoutes = require('./routes/personRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://good-management-server.vercel.app/'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));

app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Routes
app.use('/', employeeRoutes);
app.use('/', productRoutes);
app.use('/', authRoutes);
app.use('/', otpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));