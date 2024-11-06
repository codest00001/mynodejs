const bcrypt = require('bcryptjs');
const {generateAccessToken, generateRefreshToken} = require('../utils/token');
const userService = require('../services/userService');

//sign up 사용자등록
const register = async (req, res) => {
    const {email, name, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = await userService.createUser({
            email: email, name: name, password: hashedPassword,
        });
        res.status(201).json({message:'ok', data:user});
    }catch(e){
        res.status(500).json({message:e.message})
    }
}

//로그인 
const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userService.findUserByEmail(email);
        if(!user){
            return res.status(400).json({message:
                'Invalid email and password'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:
                'Invalid email and password'
            });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({
            accessToken, refreshToken
        }); 
    }catch(e){
        res.status(500).json({message:e.message})
    }
}

const jwt = require('jsonwebtoken');
const refresh = async (req, res) => {
    const {token} = req.body;
    if(!token) return res.sendStatus(401);

    jwt.verify(token, 'refresh', (err, user)=>{
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.status(200).json({
            accessToken,
        })
    })
}


module.exports = {
    register,
    login,
    refresh,
}