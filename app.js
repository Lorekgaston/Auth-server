const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const userRouter = require('./routes/userRoutes');

const app = express();
app.use(helmet());

app.use(cors());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

app.use(mongoSanitize());

app.use(xss());

app.use('/api/v1/users', userRouter);

module.exports = app;
