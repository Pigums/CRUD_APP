const express = require('express');
const router = express.Router();
const client_controller = require('../controllers/client.controller');

router.get('/', client_controller.home);

router.post('/add', client_controller.addUser);

router.get('/edit/:id', client_controller.showUser);

router.post('/edit/:id', client_controller.editUser);

router.get('/delete/:id', client_controller.deleteUser);

module.exports = router;