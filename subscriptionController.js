const Subscription = require("./models/Subscription");
const User = require("./models/User");
const UserSettings = require("./models/UserSettings");

class SubscriptionController {
    async addSubscription(req, res) {
        try {
            const user = await User.findByPk(req.params.userId);
            const userSettings = await UserSettings.findOne({where: {user_set_id: user.user_set_id}});
            const privateProfile = userSettings.private_profile;
            let subscrStatus = 1;
            if(privateProfile){
                subscrStatus = 0;
            }

            const findSubscription = await Subscription.findOne({where: {user_id: req.params.userId, subscriber_id: req.user.id}});
            if(!findSubscription) {
                const subscription = Subscription.build({subscription_status: subscrStatus, user_id: req.params.userId, subscriber_id: req.user.id});
                await subscription.save();
                res.json({subscription});
            }
            else {
                res.status(400).json({ message: "you have already subscribed" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "addSubscription error" });
        }
    }

    async deleteSubscription(req, res) {
        try {
            const subscription = await Subscription.findOne({where: {user_id: req.params.userId, subscriber_id: req.user.id}});
            if(subscription) {
                await Subscription.destroy({where: {subscription_id: subscription.subscription_id}});
                res.status(200).json({ message: "subscription deleted" });
            }
            else {
                res.status(400).json({message: "no subscription"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "deleteSubscription error" });
        }
    }

    async getSubscribers(req, res) {
        try {
            const offset = req.query.offset;
            const limit = req.query.limit;
            let subscribers = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.user.id}});
            if(req.params.userId) {
                subscribers = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {user_id: req.params.userId}});
            }
            res.json({subscribers});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getSubscribers error" });
        }
    }

    async getSubscribtions(req, res) {
        try {
            const offset = req.query.offset;
            const limit = req.query.limit;
            let subscribtions = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {subscriber_id: req.user.id}});
            if(req.params.userId){
                subscribtions = await Subscription.findAll({limit:Number(limit), offset:Number(offset), where: {subscriber_id: req.params.userId}});
            }
            
            res.json({subscribtions});
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "getSubscribtions error" });
        }
    }

    async acceptSubscription(req, res) {
        try {
            const subscription = await Subscription.findOne({where: {subscription_id: req.params.id, user_id: req.user.id, }});
            const subscrStatus = 1;
            if(subscription) {
                subscription.subscription_status = subscrStatus;
                await subscription.save();
                res.status(200).json({message: "subscription accepted"});
            }
            else {
                res.status(400).json({ message: "no such subscription" });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "acceptSubscription error" });
        }
    }
}

module.exports = new SubscriptionController();