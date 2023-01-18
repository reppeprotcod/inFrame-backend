const Reaction = require("./models/Reaction");

class ReactionController {
    async addReaction(req, res) {
        try {
            const findReaction = await Reaction.findOne({ where: { post_id: req.params.postId, user_id: req.user.id } });
            const { reaction_type } = req.body;
            if (!findReaction) {
                const reaction = Reaction.build({ reaction_type, post_id: req.params.postId, user_id: req.user.id });
                await reaction.save();
                res.json({ reaction });
            }
            else {
                res.status(400).json({ message: "only one reaction" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "addReaction error" });
        }
    }

    async getReactions(req, res) {
        try {
            const reactions = await Reaction.findAll({ where: { post_id: req.params.postId } });
            const types = new Map();

            for (let reaction of reactions) {
                if (types.has(reaction.reaction_type)) {
                    let newCount = types.get(reaction.reaction_type) + 1;
                    types.set(reaction.reaction_type, newCount);
                }
                else {
                    let count = 1;
                    types.set(reaction.reaction_type, count);
                }
            }
            res.json({types: Object.fromEntries(types.entries())});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getReactions error" });
        }
    }

    async deleteReaction(req, res) {
        try {
            const reaction = await Reaction.findOne({ where: { post_id: req.params.postId, user_id: req.user.id } });
            if (reaction) {
                await Reaction.destroy({ where: { reaction_id: reaction.reaction_id } });
                res.status(200).json({ message: "reaction deleted" });
            }
            else {
                res.status(400).json({ message: "no reaction" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "deleteReaction error" });
        }
    }
}

module.exports = new ReactionController();