const express = require('express');
const userController = require ('../controllers/userController');

const router = express.Router();

router.get('/', userController.findAll); //app.get("/users", (req, res)=>{}) 부분에 해당함
//findAll뒤에 () 안 적는다. ()넣으면 바로 호출되므로.

router.post('/', userController.createUser); //app.post("/users", (req, res)=>{})부분에 해당함

module.exports = router;