const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');

const app = express();
app.use(cors());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

app.use('/api/v1/users', userRouter);

module.exports = app;
