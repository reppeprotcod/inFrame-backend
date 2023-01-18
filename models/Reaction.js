const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Reaction = sequelize.define('reactions', {
    reaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    reaction_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Reaction;