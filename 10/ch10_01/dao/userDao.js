const models = require('../models') //모델스 안의 index.js db가 모델스에 담김

//User만을 위한 DAO
const findAll = async () => {
    return await models.User.findAll();
// select * from users와 같은 코드임
}

const createUser = async (userData) => {
    return await models.User.create(userData)
}

const findUserByEmail = async (email) => {
    return await models.User.findOne({
        where : {email : email}
    })
} // select * from users where email = email과 같은 것임


module.exports = {
    findAll, 
    createUser,
    findUserByEmail,
}