const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

const app = express();

//  Global variables
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
});

//  Connection to DB
mongoose.connect('mongodb://localhost/crud')
    .then(db => console.log('DB Connected!'))
    .catch(err => console.log(err));

//  Importing routes
const indexRoutes = require('./routes/index.route.js');

//  Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//  Routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});