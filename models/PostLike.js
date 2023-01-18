const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const PostLike = sequelize.define('posts_likes', {
    post_like_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = PostLike;