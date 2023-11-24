const userRoutes = require('./users');
const housesRoutes = require('./houses');
// const roomsRoutes = require('./rooms');

const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/houses', housesRoutes);
    // app.use('/routines', roomsRoutes);
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;