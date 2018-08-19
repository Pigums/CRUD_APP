const express = require('express');
const router = express.Router();
const Client = require('../models/client.model.js');
const expressValidator = require('express-validator');

//  Home route
router.get('/', (req, res) => {
    const clients = Client.find((err, docs) => {
        res.render('index', {
            clients: docs
        });
    });
    
});

//  POST: Add user
router.post('/add', (req, res, next) => {
    req.checkBody('firstName', 'First name is required.').notEmpty();
    req.checkBody('lastName', 'Last name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'You must include a correct email.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        const client = Client.find((err, docs) => {
            res.render('index', {
                clients: docs,
                errors: errors
            });
        });
    } else {
        const client = new Client(
            {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email
            }
        );
        client.save((err) => {
            if (err) return next(err);
        });
        res.redirect('/');
    }
});

//  GET: Edit user
router.get('/edit/:id', (req, res, next) => {
    const client = Client.findById(req.params.id, (err, doc) => {
        if (err) return next(err);
        console.log(client);
        res.render('edit', { client: doc });
    });
});

//  POST: Edit user
router.post('/edit/:id', (req, res, next) => {
    Client.findByIdAndUpdate(req.params.id, {$set: {first_name: req.body.firstName, last_name: req.body.lastName, email: req.body.email}}, (err) => {
        if(err) return next(err);
        res.redirect('/');
    });
});

//  GET: Delete user
router.get('/delete/:id', (req, res, next) => {
    Client.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;