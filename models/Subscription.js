const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Subscription = sequelize.define('subscriptions', {
    subscription_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    subscription_status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Subscription;