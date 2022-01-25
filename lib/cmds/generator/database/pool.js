const {
    mysql
} = require('./mysql')

const defaultOptions = {
    connectionLimit: 5,
    queueLimit: 5,
    host: '192.168.0.11',
    port: 3307,
    user: "root",
    password: "root",
    database: "blogger"
}

const pool = createPool(defaultOptions)

// pool.on('acquire', function (connection) {
//     console.log('Connection %d acquired', connection.threadId);
// });

// pool.on('connection', function (connection) {
//     connection.query('SET SESSION auto_increment_increment=1')
// });

// pool.on('enqueue', function () {
//     console.log('Waiting for available connection slot');
// });

// pool.on('release', function (connection) {
//     console.log('Connection %d released', connection.threadId);
// });

// pool.end(function (err) {
//     console.log('Connection end');
// });

/**
 * 创建连接池
 */
function createDefaultPool() {
    return mysql.createPool(defaultOptions)
}

function createPool(options = defaultOptions) {
    return mysql.createPool(options)
}

module.exports = {
    pool,
    createPool,
    createDefaultPool
}