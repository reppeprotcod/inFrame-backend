const Comment = require("./models/Comment");
const CommentLike = require("./models/CommentLike");
const Post = require("./models/Post");

class CommentController {
    async getAllComments(req, res) {
        try {
            const offset = req.query.offset;
            const limit = req.query.limit;
            const comments = await Comment.findAll({limit:Number(limit), offset:Number(offset), where: {post_id: req.params.postId}});
            for (let i = 0; i < comments.length; i++) {
                const likes = await CommentLike.findAll({where: {comment_id: comments[i].comment_id}});
                comments[i].setDataValue('likeCount', likes.length);
            }
            res.json({comments});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getAllComments error"});
        }
    }

    async addComment(req, res) {
        try {
            const date = new Date().toUTCString();
            const {text} = req.body;
            const comment = Comment.build({date, text, post_id: req.params.postId, user_id: req.user.id});
            await comment.save();
            res.json({comment});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "addComment error"});
        }
    }

    async deleteComment(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id);
            const post = await Post.findByPk(comment.post_id);
            if(comment.user_id === req.user.id || post.user_id === req.user.id) {
                await Comment.destroy({where: {comment_id: req.params.id}});
                res.status(200).json({message: "comment deleted"});
            }
            else {
                res.status(400).json({message: "no rules"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "deleteComment error"});
        }
    }
}

module.exports = new CommentController();