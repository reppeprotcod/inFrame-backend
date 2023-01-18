const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('./models/User');
const Role = require('./models/Role');
const UserSettings = require('./models/UserSettings');

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, config.get('secret'), {expiresIn: '24h'});
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                console.log(errors);
                return res.status(400).json({message: errors.errors[0].msg});
            }

            const {email, password, username, user_photo, birth_date} = req.body;

            const candidate = await User.findOne({where: {username: username}});
            if(candidate) {
                return res.status(400).json({message: "User with such name already exists"});
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const role = await Role.findOne({where: {role_title: "user"}});
            const userSettings = UserSettings.build({theme: 0, private_profile: 0});
            await userSettings.save();

            const user = User.build({email, password: hashPassword, username, user_photo, birth_date, user_set_id: userSettings.user_set_id, role_id: role.role_id });
            await user.save();
            //res.status(200).json({message: 'Пользователь создан'});
            res.json({user});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: "registration error"});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;

            const user = await User.findOne({where: {username: username}});
            if(!user){
                return res.status(400).json({message: "User is not found"});              
            }

            const comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword){
                return res.status(400).json({message: "invalid password"});
            }

            const token = generateAccessToken(user.user_id);
            res.json({token});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: "login error"});
        }
    }
    
    async getUserSettings(req, res) {
        try {
            const user = await User.findOne({where: {user_id: req.user.id}});
            const userSettings = await UserSettings.findOne({where: {user_set_id: user.user_set_id}});
            res.json({userSettings});

        } catch (e) {
            console.log(e);
            res.status(400).json({message: "getUserSettings error"});
        }
    }

    async userSettings(req, res) {
        try {
            const {theme, private_profile} = req.body;
            const user = await User.findOne({where: {user_id: req.user.id}});
            const userSettings = await UserSettings.findOne({where: {user_set_id: user.user_set_id}});
            userSettings.theme = theme;
            userSettings.private_profile = private_profile;
            await userSettings.save();
            res.json({userSettings});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "UserSettings error"});
        }
    }
}

module.exports = new AuthController();