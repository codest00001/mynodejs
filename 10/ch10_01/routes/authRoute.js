const express = require('express');
const {register, login, refresh} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
// localhost:3000/auth/register
router.post('/login', login);
// localhost:3000/auth/login
router.post('/refresh', refresh);
// localhost:3000/auth/refresh

module.exports = router;
