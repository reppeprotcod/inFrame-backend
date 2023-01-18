const {Router} = require('express');
const {check} = require('express-validator');
const AuthController = require('./authController');
const CommentController = require('./commentController');
const CommentLikeController = require('./commentLikeController');
const authMiddleware = require('./middleware/auth.middleware');
const PostController = require('./postController');
const PostLikeConroller = require('./postLikeConroller');
const ReactionController = require('./reactionController');
const RepostController = require('./repostController');
const SubscriptionController = require('./subscriptionController');


const router = new Router();

router.post('/registration', [
    check('email', "it's shpuld be email").isEmail(),
    check('username', "username cannot be empty").notEmpty(),
    check('password', "password length cannot be less than 6 and more than 50").isLength({min: 6, max: 50})
], AuthController.registration);
router.post('/login', AuthController.login);
router.get('/getUserSettings', authMiddleware, AuthController.getUserSettings);
router.put('/userSettings', authMiddleware, AuthController.userSettings);

router.post('/createPost', authMiddleware, PostController.createPost);
router.get('/getPosts', authMiddleware, PostController.getAllPosts);
router.get('/getPosts/:userId', authMiddleware, PostController.getAllPosts);
router.delete('/deletePost/:id', authMiddleware, PostController.deletePost);

router.get('/getAllComments/:postId', authMiddleware, CommentController.getAllComments);
router.post('/addComment/:postId', authMiddleware, CommentController.addComment);
router.delete('/deleteComment/:id', authMiddleware, CommentController.deleteComment);

router.post('/addLike/:postId', authMiddleware, PostLikeConroller.addLike);
//router.get('/getLikes/:postId', authMiddleware, PostLikeConroller.getLikes);
router.delete('/deleteLike/:postId', authMiddleware, PostLikeConroller.deleteLike);

router.post('/addComLike/:comId', authMiddleware, CommentLikeController.addComLike);
router.delete('/deleteComLike/:comId', authMiddleware, CommentLikeController.deleteComLike);

router.post('/addReaction/:postId', authMiddleware, ReactionController.addReaction);
router.get('/getReactions/:postId', authMiddleware, ReactionController.getReactions);
router.delete('/deleteReaction/:postId', authMiddleware, ReactionController.deleteReaction);

router.post('/addRepost/:postId', authMiddleware, RepostController.addRepost);
router.delete('/deleteRepost/:postId', authMiddleware, RepostController.deleteRepost);
router.get('/getReposts/:userId', authMiddleware, RepostController.getReposts);
router.get('/getReposts', authMiddleware, RepostController.getReposts);

router.post('/addSubscription/:userId', authMiddleware, SubscriptionController.addSubscription);
router.delete('/deleteSubscription/:userId', authMiddleware, SubscriptionController.deleteSubscription);
router.get('/acceptSubscription/:id', authMiddleware, SubscriptionController.acceptSubscription);
router.get('/getSubscriptions/:userId', authMiddleware, SubscriptionController.getSubscribtions);
router.get('/getSubscriptions', authMiddleware, SubscriptionController.getSubscribtions);
router.get('/getSubscribers/:userId', authMiddleware, SubscriptionController.getSubscribers);
router.get('/getSubscribers', authMiddleware, SubscriptionController.getSubscribers);

module.exports = router;