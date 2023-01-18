const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Repost = sequelize.define('reposts', {
    repost_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});


(async () => {
    await sequelize.sync(); 
})();

module.exports = Repost;