const config = require('config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    config.get('db_name'), config.get('user'), config.get('password'), {
        dialect: config.get('dialect')
    }
);

module.exports = sequelize;