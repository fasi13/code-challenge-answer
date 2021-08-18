if (process.env.NODE_ENV === 'production') {
    module.exports = require('./mongo-keys/prodKeys')
} else {
    module.exports = require('./mongo-keys/devKeys')
}