const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const employeeRoutes = require('./routes/personRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://good-management-client.vercel.app'],
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

app.listen(5000, () => console.log(`Server running on port 5000`));