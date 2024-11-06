const express = require('express');
const userController = require ('../controllers/userController');
const { check } = require('express-validator')

const router = express.Router();

router.get('/', userController.findAll); //app.get("/users", (req, res)=>{}) 부분에 해당함
//findAll뒤에 () 안 적는다. ()넣으면 바로 호출되므로.
//app.js 에서 /users라고 들어오는 모든 것을 userRoute로 오게 했기 때문에 여기서는 / 만 적음.

router.post('/', [
    check('name').notEmpty().withMessage("Name is required"), //
    check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("invalid email format")
], userController.createUser); //app.post("/users", (req, res)=>{})부분에 해당함

module.exports = router;