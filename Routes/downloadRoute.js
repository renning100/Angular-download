const express = require('express');
const downloadController = require('../Controllers/downloadController');
const Router = express.Router();

Router.get('/databases', downloadController.database);
Router.post('/database', downloadController.tableByDb);
Router.get('/table', downloadController.table);
Router.post('/view', downloadController.viewByDb);
Router.post('/csv/multi', downloadController.downloadMultiple);
Router.post('/xls/multi', downloadController.downloadMultiple);
Router.post('/json/multi', downloadController.downloadMultiple);
Router.post('/tsv/multi', downloadController.downloadMultiple);
Router.post('/txt/multi', downloadController.downloadMultiple);
Router.post('/txt/', downloadController.downloadSingle);
Router.post('/csv/', downloadController.downloadSingle);
Router.post('/tsv/', downloadController.downloadSingle);
Router.post('/json/', downloadController.downloadSingle);
Router.post('/xls/', downloadController.downloadSingle);



module.exports = Router;