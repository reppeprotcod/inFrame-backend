const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Reaction = require('./Reaction');
const Repost = require('./Repost');
const Comment = require('./Comment');
const PostLike = require('./PostLike');

const Post = sequelize.define('posts', {
    post_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Reaction.belongsTo(Post, {
    foreignKey: 'post_id'
});
Post.hasMany(Reaction, {
    foreignKey: 'post_id'
});

Repost.belongsTo(Post, {
    foreignKey: 'post_id'
});
Post.hasMany(Repost, {
    foreignKey: 'post_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

PostLike.belongsTo(Post, {
    foreignKey: 'post_id'
});
Post.hasMany(PostLike, {
    foreignKey: 'post_id'
});

(async () => {
    await sequelize.sync(); 
})();

module.exports = Post;