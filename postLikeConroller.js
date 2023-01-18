const Post = require("./models/Post");
const PostLike = require("./models/PostLike");

class PostLikeController{
    async addLike(req, res) {
        try {
            const existingLike = await PostLike.findOne({where: {post_id: req.params.postId, user_id: req.user.id}});
            if(!existingLike) {
                const like = PostLike.build({post_id: req.params.postId, user_id: req.user.id});
                await like.save();
                res.json({like});
            }
            else {
                res.status(400).json({message: "only one like"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "addLike error"});
        }
    }

    // async getLikes(req, res) {
    //     try {
    //         const offset = req.query.offset;
    //         const limit = req.query.limit;
    //         const likes = await PostLike.findAll({limit:Number(limit), offset:Number(offset), where: {post_id: req.params.postId}});
    //         res.json({likes});
    //     } catch (e) {
    //         console.log(e);
    //         res.status(400).json({message: "getLikes error"});
    //     }
    // }

    async deleteLike(req, res) {
        try {
            const like = await PostLike.findOne({where: {post_id: req.params.postId, user_id: req.user.id}});
            if(like) {
                await PostLike.destroy({where: {post_like_id: like.post_like_id}});
                res.status(200).json({message: "like deleted"});
            }
            else {
                res.status(400).json({message: "no rules"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deleteLike error"});
        }
    }
}

module.exports = new PostLikeController();