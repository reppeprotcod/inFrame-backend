const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const CommentLike = sequelize.define('comments_likes', {
    comment_like_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = CommentLike;