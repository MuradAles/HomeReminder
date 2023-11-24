const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');


app.use(express.json());


app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 6000000 }
    })
);

let urTrack = {};
app.use((req, res, next) => {
    if (!urTrack[req.method + req.originalUrl]) {
        urTrack[req.method + req.originalUrl] = 0
    }
    // console.log(req.method + req.originalUrl)
    urTrack[req.method + req.originalUrl] += 1;
    if (!req.session.user) {
        console.log("User not Authorized")
    }
    else {
        console.log("User Authorized")
    }
    let temp = req.body
    if (!temp.password) {
        console.log(req.method + ' ' + req.originalUrl + ' ' + urTrack[req.method + req.originalUrl] + ' ' + JSON.stringify(req.body))
    }
    else {
        console.log(req.method + ' ' + req.originalUrl + ' ' + urTrack[req.method + req.originalUrl] + ' ' + JSON.stringify(req.body.name) + ' ' + JSON.stringify(req.body.username))
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
