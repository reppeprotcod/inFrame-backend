const Post = require("./models/Post");
const PostLike = require("./models/PostLike");

class PostController {
    async createPost(req, res) {
        try {
            const date = new Date().toUTCString();
            const {photo, description} = req.body;
            const post = Post.build({date, photo, description, user_id: req.user.id});
            await post.save();
            res.json({post});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "createPost error"});
        }
    }

    async getAllPosts(req, res) {
        try {
            const offset = req.query.offset;
            const limit = req.query.limit;
            let posts = await Post.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.user.id}});
            if(req.params.userId) {
                posts = await Post.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.params.userId}});
            }
            for (let i = 0; i < posts.length; i++) {
                const likes = await PostLike.findAll({where: {post_id: posts[i].post_id}});
                posts[i].setDataValue('likeCount', likes.length);
            }
            res.json({posts});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getAllPosts error"});
        }
    }

    async deletePost(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            if(post.user_id === req.user.id) {
                await Post.destroy({where: {post_id: req.params.id}});
                res.status(200).json({message: "post deleted"});
            }
            else {
                res.status(400).json({message: "no rules"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deletePost error"});
        }
    }

}

module.exports = new PostController();