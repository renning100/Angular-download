const express = require('express');
const connectionController = require('../Controllers/connectionController');
const Router = express.Router();


Router.post('/connection/', connectionController.connectionU);


module.exports = Router;