// const userRoutes = require('./users');
// const listsRoutes = require('./lists');
// const roomsRoutes = require('./rooms');

const constructorMethod = (app) => {
    // app.use('/users', userRoutes);
    // app.use('/exercises', listsRoutes);
    // app.use('/routines', roomsRoutes);
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;