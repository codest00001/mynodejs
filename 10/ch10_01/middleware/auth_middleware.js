//액세스 토큰을 검증하여 유효한 사용자인지 확인하는 미들웨어
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization.split(' ')[1]; // 원래가 Bearer xxxxxxxx 이러한 모양이므로 공백기준으로 나누면 공백 뒤의 토큰만 불러와짐.
    }
    if(!token) return res.sendStatus(401);
    jwt.verify(token, 'access', (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    })
}

module.exports = {
    authenticate,
}