const userService = require('../services/userService');
const {validationResult} = require('express-validator');

const createUser = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array().map(e=>e.msg)})
        }
        const user = await userService.createUser(req.body);
        res.status(201).json({data:user, message:'ok'})
    }catch(e){
        res.status(500).json({message:e})
    }
}

const findAll = async (req, res) => {
    try{
        const users = await userService.findAll();
        res.status(200).json({data:users, message:'ok'})
    }catch(e) { 
        res.status(500).json({message:e})
    }
}



module.exports = {
    findAll,
    createUser,
}