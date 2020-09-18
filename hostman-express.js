const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const middlewares = require('./middlewares');
const api = require('./api');
const front = require('./front');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use("/api/*", express.json());


