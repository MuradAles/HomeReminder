const MongoClient = require('mongodb').MongoClient;
const serverUrl = 'mongodb://localhost:27017/';
const mongoConfig = {
    serverUrl: serverUrl,
    database: 'HomeRoutine',
};

let _connection = undefined;
let _db = undefined;

module.exports = {
    dbConnection: async () => {
        if (!_connection) {
            _connection = await MongoClient.connect(mongoConfig.serverUrl);
            _db = await _connection.db(mongoConfig.database);
        }

        return _db;
    },
    closeConnection: () => {
        _connection.close();
    },
};